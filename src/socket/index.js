// import models here
const { chat, user } = require('../../models')

// on = penerima informasi/event
// emit = pengirim informasi

const socketIo = (io) => {
  io.on('connection', (socket) => {
    console.log('client connect: ', socket.id)

    // code here
    socket.on("load admin contact", async () => {
      try {
        const adminContact = await user.findOne({
          where: {
            status: "admin"
          },
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password']
          }
        })

        socket.emit("admin contact", adminContact)
      } catch (error) {
        console.log(err);
      }
    })

    socket.on("load customer contacts", async () => {
      try {
        let customerContacts = await user.findAll({
          include: [
            {
              model: chat,
              as: "senderMessage",
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'idRecipient', 'idSender']
              }
            },
            {
              model: chat,
              as: "recipientMessage",
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'idRecipient', 'idSender']
              }
            }
          ],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password']
          },
          where: {
            status: "customer"
          }
        })

        customerContacts = JSON.parse(JSON.stringify(customerContacts))
        customerContacts = customerContacts.map(item => ({
          ...item,
          image: item.image ? process.env.PATH_FILE + item.image : null
        }))

        socket.emit("customer contacts", customerContacts)
      } catch (error) {
        console.log(err);
      }
    })

    socket.on("disconnect", () => {
      console.log("client disconnect")
    })
  })
}

module.exports = socketIo