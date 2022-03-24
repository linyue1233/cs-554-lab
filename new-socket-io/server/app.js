const app = require('express');
const http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('new client connected', socket.id);

  let oroom ;

  socket.on('user_join', (name,room) => {

    oroom = room;

    socket.join(room);
    socket.to(oroom).emit('user_join', name);
  });

  socket.on('message', ({name, message}) => {
    console.log(name, message, socket.id);
    io.to(oroom).emit('message', {name, message});
  });

  socket.on('disconnect', () => {
    console.log('Disconnect Fired');
  });
});

http.listen(4000, () => {
  console.log(`listening on *:${4000}`);
});
