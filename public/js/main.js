const chatForm= document.getElementById('chat-form');
const socket=io('/'); 

//Get ueer data from the server
const username=document.getElementById('ejsusername').innerText;
const room=document.getElementById('ejsroom').innerText;
const pwd=document.getElementById('ejspwd').innerText;
const game=document.getElementById('ejsgame').innerText; 

const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '8080'
});
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream);

  myPeer.on('call', call => {
    call.answer(stream);
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
  });

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream);
  });
});

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close();
})

myPeer.on('open', id => {
  //Join chatroom
    console.log(id);
    socket.emit('joinRoom',{username,room,pwd,game},id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    video.remove()
  });

  peers[userId] = call;
  console.log(peers);
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });

  videoGrid.append(video);
}






//For chat Box -------------

document.getElementById('room-name').innerText=room;
socket.on('roomUsers',(data)=>{
    const users_list=data.users;
    document.getElementById('users').innerHTML='';
    users_list.forEach(element=> {
        document.getElementById('users').innerHTML+=`<li>${element.username}</li>`;
    });
});

//Message from server 
socket.on('message',msg=>{
    document.getElementById('chat-content').innerHTML+=`<div class="message"><p class="meta">${msg.username} <span>${msg.time}</span></p><p class="text"> ${msg.text} </p></div>`;
    document.querySelector('.chat-messages').scrollTop=document.querySelector('.chat-messages').scrollHeight;
});

//Message submit
chatForm.addEventListener('submit',(e) => {
    e.preventDefault();

    //Get message text 
    const msg=e.target.elements.msg.value;

    //emitting the sent message
    socket.emit('sent-message',{msg,username,room});
    //making the message box blank 
    e.target.elements.msg.value='';
});

