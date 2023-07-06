const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io')
const server = http.createServer(app)
const io = socketIO(server)
const postController = require('./routes/postController');
const routes = require('./routes/auth');

require('dotenv').config()
require('./models/dbConnections');
require('./models/userSchema');
require('./models/postSchema');

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(postController);


io.on('connection', (socket) => {
  console.log("A client is connected!")
  socket.on("sendMessage", (message) => {
    console.log(message);
  })
  socket.on('disconnect', () => {
    console.log('User disconnected!');
  })

})

server.listen(5500, () => {
  console.log("Server running on port 5500");
});
