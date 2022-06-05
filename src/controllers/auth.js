const {user} = require('../../models')
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.Register = async (req,res) => {
    const schema = Joi.object({
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
        name: Joi.string().min(5).required()
      });
    
      // do validation and get error object from schema.validate
      const { error } = schema.validate(req.body);
    
      // if error exist send validation error message
      if (error)
        return res.status(400).send({
          error: {
            message: error.details[0].message,
          },
        });
    
      // const userExist = await user.findOne({
      //   where: {
      //     email: req.body.email,
      //   },
      //   attributes: {
      //     exclude: ["createdAt", "updatedAt"],
      //   },
      // });
    
      // if (userExist) {
      //   return res.status(400).send({
      //     status: 'failed',
      //     message: 'email has already taken'
      //   });
      // }
    
      try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
    
        const newUser = await user.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: "user"
        });

        const token = jwt.sign({id: user.id}, process.env.TOKEN_KEY)
    
        res.status(200).send({
          status: "success...",
          data: {
            name: newUser.name,
            email: newUser.email,
            token
          },
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          status: "failed",
          message: "Server register Error",
        });
      }
}

exports.login = async (req, res) => {
    // our validation schema here
    const schema = Joi.object({
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(6).required(),
    });
  
    // do validation and get error object from schema.validate
    const { error } = schema.validate(req.body);
  
    // if error exist send validation error message
    if (error)
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
  
    try {
      const userExist = await user.findOne({
        where: {
          email: req.body.email,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      // auth
      const isValid = await bcrypt.compare(req.body.password, userExist.password)
  
      if (!isValid) {
        return res.status(400).send({
          status: "failed",
          message: "email or password doesnt match"
        });
      }

      const token = jwt.sign({id : userExist.id}, process.env.TOKEN_KEY)
  
      res.status(200).send({
        status: "success",
        data: {
          id: userExist.id,
          name: userExist.name,
          email: userExist.email,
          phone: userExist.phone,
          gender: userExist.gender,
          address: userExist.address,
          role: userExist.role,
          token
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "failed",
        message: "Server Error",
      });
    }
  };

  exports.checkAuth = async (req, res) => {
    try {
      const id = req.user.id;

      const dataUser = await user.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      });

      if (!dataUser) {
        return res.status(404).send({
          status: "failed",
        });
      }

      res.send({
        status: "success...",
        data: {
          user: {
            id: dataUser.id,
            name: dataUser.name,
            email: dataUser.email,
            status: dataUser.status,
          },
        },
      });
    } catch (error) {
      console.log(error);
      res.status({
        status: "failed",
        message: "Server Error",
      });
    }
  };