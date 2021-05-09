const rooms=[];

const x={
    room:"temp",
    pwd:"pass",
    game:"game1"
};
rooms.push(x);

//Function to add room
function addRoom(room,pwd,game){
    rooms.push({room,pwd,game});
}

//Function to remove room
function removeRoom(room){
    const elem=rooms.find(x=> x.room===room)
    const index=rooms.indexOf(elem);
    if(index !=-1){
        rooms.splice(index,1);
    }
}

//Function for getting the list of rooms
function getRooms(){
    return rooms;
}

//Function for getting the room
function isRoomAvail(room){

    const elem=rooms.find(x=> x.room === room)
    const index =rooms.indexOf(elem);
    if(index==-1){
        return false;
    }
    else{
        return true;
    }
}

//Function for checking the password for a room

function checkPassword(room,pwd){
    const elem=rooms.find(x => x.room === room);
    if(elem.pwd==pwd){
        return true;
    }
    else{
        return false;
    }
}

function findGame(room){
    const elem=rooms.find(x=> x.room === room)
    if(elem){
        return elem.game;
    }
}

module.exports={
    addRoom,
    removeRoom,
    getRooms,
    isRoomAvail,
    checkPassword,
    findGame
};
