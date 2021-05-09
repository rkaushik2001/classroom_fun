const path=require('path');
const http =require('http');
const bodyParser = require("body-parser");
const express= require('express');
const socketio=require('socket.io');
const formatMessage = require('./utils/messages.js');
const {userJoin,getCurrentUser,removeUser,getRoomUsers}=require('./utils/users.js');
const {addRoom,removeRoom,getRooms,isRoomAvail,checkPassword,findGame}=require('./utils/rooms.js');


const app= express();
const server=http.createServer(app);
const io=socketio(server);

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Set static folder
app.use(express.static('public'));
app.set('view engine','ejs');

//Configuring Peer Js server
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
debug: true,
});
app.use("/peerjs", peerServer);

//Run when client connnnects

io.on('connection',(socket)=>{

    socket.on('joinRoom',({username,room,pwd,game},userId)=>{

        const user=userJoin(socket.id, username, room);

        //socket.to(user.room).broadcast.emit('newjoinall',getRoomUsers(user.room).length);
        socket.emit('newjoin',getRoomUsers(user.room).length-1);
        

        console.log(getRoomUsers(user.room).length-1);
        if(!isRoomAvail( user.room )){
            addRoom(user.room,pwd,game);
        }
        socket.join(user.room);
        socket.to(user.room).broadcast.emit('user-connected', userId);
        console.log(user.room+"  "+userId);
        console.log(getRoomUsers(user.room));

        socket.on('disconnect', () => {
            socket.to(user.room).broadcast.emit('user-disconnected', userId);

          });

        
        socket.on('newlist',list=>{
            io.to(user.room).emit('newarray',list);
        });
        //Welcome current user
        socket.emit('message',formatMessage('Chat Bot','Welcome to RealChat'));

        //Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message',formatMessage('Chat Bot',`${username} has joined the chat`));

        //Send users and room info 
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });

    });

    //Sending the room list to index.html
    io.emit('roomList',getRooms());

    //Broadcast when user sent a message
    socket.on('sent-message',data => {
        io.to(data.room).emit('message',formatMessage(data.username,data.msg));

    //
    });

    //Runs when client disconneted
    socket.on('disconnect',() => {
        const user=getCurrentUser(socket.id);

        if(user)
        {
            io.to(user.room).emit('message',formatMessage('RealChat Bot',`${user.username} has left the chat`));
            removeUser(user.id);
            if(getRoomUsers(user.room).length==0){
                removeRoom(user.room);
                io.emit('roomList',getRooms());
            }
            
            //Send users and room info 
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            });

        }

        });

       
   
});


app.post('/join',(req,res)=>{
    var username=req.body.username;
    var room=req.body.room;
    var pwd=req.body.pwd;
    var game=findGame(req.body.room);
    if(checkPassword(room,pwd)){
    res.render(game,{username:username,room:room,pwd:pwd,game:game});
    
}
    else{
        res.render('index',{msg:'wp'});
    }
    
});
app.post('/create',(req,res)=>{
    res.render(req.body.game,{
        username:req.body.username,
        room:req.body.room,
        pwd:req.body.pwd,
        game:req.body.game
    });
});

app.get('/',(req,res)=>{
    res.render('index',{msg:''});
});
const PORT = process.env.PORT || 8080;

server.listen(PORT,() => console.log(`server running on port ${PORT}`));