//instantiate express module
require('dotenv').config()
const cors = require('cors')

const http = require('http')
const {Server} = require('socket.io')

const express = require('express')
const router = require('./src/routes')

//use express in app variable
const app = express()

const server = http.createServer(app)
const io = new Server(server, {
 cors: {
   origin: 'http://localhost:3000' // define client origin if both client and server have different origin
 }
})

require('./src/socket')(io)

const port = 5001

app.use(express.json())
app.use(cors())

//endpoint routing
app.use('/api/v1', router)

//static file upload
app.use('/uploads', express.static('uploads'))

//when this nodejs app executed, it will listen to defined port
app.listen(port, () => console.log(`Progress on port ${port}!`))