const {buku} = require('../../models')

exports.getbukus = async (req, res) => {
    try {
      let data = await buku.findAll({
          model: buku,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "idUser"],
          },
      });

      data = JSON.parse(JSON.stringify(data));

    bukus = data.map((item) => {
      return { ...item, bookCover: process.env.PATH_FILE + item.bookCover };
    });
   
      res.send({
        status: "success",
        data: {
          bukus,
          
        },
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Server buku Error",
      });
    }
  };

exports.detailbukus = async (req, res) => {
    try {
        const {id} = req.params
      let data = await buku.findOne({
         where : {
            id,
         },
        attributes: {
            exclude: ["createdAt", "updatedAt"],
        }
      });
      // data = JSON.parse(JSON.stringify(data));
      // data = {
      //   ...data,bookCover: process.env.PATH_FILE + data.bookCover,
      // };
      res.send({
        status: "success",
        data,
      });
      
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Server buku Error",
      });
    }
  };

exports.addbuku = async (req, res) => {
    try {
        let data = req.body
        let newBook = await buku.create({
          ...data,
          bookCover: req.file.filename
        })

        // newBook = JSON.parse(JSON.stringify(newBook))

        res.send({
            status:"success",
            data: {
              newBook,
              bookCover: 'http://localhost:5001/uploads/' + newBook.bookCover
            // attributes: {
            //     exclude: ["createdAt", "updatedAt"],
            // }
            }
        })
    } catch (error) {
        res.send({
            status:"failed",
            message:"create data not found"
        })
    }
}

exports.updateBukus = async (req, res) => {
    try {
        const {id} = req.params
        const newData = req.body

        await buku.update(newData,{
            where : {
                id
            }
      });
  
      res.send({
        status: "success",
        data: {
          newData
        },
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Server update Error",
      });
    }
  };

  exports.deleteBukus = async (req, res) => {
    try {
        const { id } = req.params

        await buku.destroy({
            where: {
                id
            }
        })

        res.send({
            status: 'success',
            message: `Delete user id: ${id} finished`
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}