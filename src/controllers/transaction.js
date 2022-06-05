const {transaction, user, product} = require('../../models')

exports.addTransaction = async (req, res) => {
  try {
      let data = req.body
      data = {
        ...data,
        idBuyer: req.user.id,
      }
      await transaction.create(data);

      res.send({
          status:"success",
          data,
          // attributes: {
          //     exclude: ["createdAt", "updatedAt"],
          // }
      })
  } catch (error) {
      res.send({
          status:"failed",
          message:"create data not found"
      })
  }
}

exports.getTransaction = async (req, res) => {
    try {
      const idBuyer = req.user.id
      const data = await transaction.findOne({
        where: {
          id : id,
        },
        // include: {
        //   model: user,
        //   as: "user",
        //   attributes: {
        //     exclude: ["createdAt", "updatedAt", "email","password","role","subscribe"],
        //   }
        // },
        attributes: {
          exclude: ["createdAt", "updatedAt", "UserId","userId"],
        },
      });
  
      res.send({
        status: "success",
        data: {
          data,
        },
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Server transaction Error",
      });
    }
  };
exports.getTransactions = async (req, res) => {
    try {
      // const idBuyer = req.user.id
      let data = await transaction.findAll({
        // where: {
        //   idBuyer,
        // },
        attributes: {
          exclude: ["updatedAt", "createdAt", "idBuyer", "idSeller", "idProduct"],
        },
        include: [
          {
            model: product,
            as: "product",
            attributes: {
              exclude: ["createdAt", 
              "updateAt", "id",
              "updateAt", "idUser", 
              "qty", "price", "desc"],
            },
          },
          {
            model: user,
            as: "buyer",
            attributes: {
              exclude: ["id", "role", 
              "phone", "gender", "createdAt", 
              "updatedAt", "password", "status"],
            },
          },
          {
            model: user,
            as: "seller",
            attributes: {
              exclude: ["id", "role", 
              "phone", "gender", "createdAt", 
              "updatedAt", "password", "status"],
            },
          },
        ],
      });

      data = JSON.parse(JSON.stringify(data))

      data=data.map((item) => {
        return{
          ...item,
          product: {
            ...item.product,
            Image: process.env.PATH_FILE + item.product.image,
          }
        }
      })

      res.send({
        status: "success",
        data,
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Server transaction something when wrong",
      });
    }
  };

exports.updateTransaction = async (req, res) => {
    try {
      const {id} = req.params
        const newData = req.body

        await transaction.update(newData,{
            where : {
                id:id
            }
      });
  
      res.send({
        status: "success",
        message:`update user id ${id} finished`,
          newData
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Server edit transaction Error",
      });
    }
  };