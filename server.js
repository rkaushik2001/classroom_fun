const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

const room_game={};
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {

  res.render('index');
  //res.redirect(`/${uuidV4()}`)
});

app.get('/game1',(req,res)=>{

  //res.render('game1',{roomId:uuidV4()});
  //res.redirect(`/game1/${uuidV4()}`);
  var rid=uuidV4();
  room_game[rid]='game1';
  res.redirect(`/${rid}`);
  

});
app.get('/:room', (req, res) => {

  if(room_game[req.params.room]){
    var game=room_game[req.params.room];
  res.render(game, { roomId: req.params.room });
  }
  else{
    console.log("Room not found"); 
    res.render('index');
  }
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId);
    });
  });
});

server.listen(3000)