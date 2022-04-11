// const io = require('socket.io')()
// const socketapi = {
//   io: io
// }

// // Add your socket.io logic here!
// io.on('connection', function (socket) {
//   console.log('A user connected')
// })

// io.on('message', msg => {
//   console.log(msg)
// })
// // end of socket.io logic

// module.exports = socketapi

const socketIO = require('socket.io')
const io = socketIO()
const socketApi = {}

socketApi.io = io

io.on('connection', function (socket) {
  console.log('A user connected', socket)
})

socketApi.sendNotification = function () {
  io.sockets.emit('hello', { msg: 'Hello World!' })
}

module.exports = socketApi
