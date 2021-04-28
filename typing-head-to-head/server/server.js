const { json, response } = require("express");
const express = require("express");
const PORT = process.env.PORT || 8080;
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');

const PUBLIC_WAITING_ROOM = 'publicWaitingRoom'

io.on('connection', (socket) => { 
  socket.on('setUsername', (username) =>{
    socket.username = username;
  })
  socket.on('word', (currentPosition) =>{
    socket.to(socket.room).emit('updateOpponentPosition',currentPosition)
  })
  socket.on('complete', function(){
    io.emit('endRace', socket.id);
  })
  socket.on('leavePrivateRoom', (privateRoom) =>{
    socket.leave(privateRoom);
  })
  socket.on('privateGame',(privateRoom) =>{
    socket.join(privateRoom);
    matchUsers(privateRoom)
  })
  socket.on('soloGame', function(){
    startGame(socket.id)
  })
  socket.on('findGame', function() {
    if(socket.rooms.has(PUBLIC_WAITING_ROOM)){
      socket.leave(PUBLIC_WAITING_ROOM)
      socket.emit('inWaiting', false)
      return;
    }
    socket.emit('inWaiting', true)
    socket.join(PUBLIC_WAITING_ROOM)
    matchUsers(PUBLIC_WAITING_ROOM)
  })
  socket.on("disconnect", () => {
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

async function matchUsers(room){
  let sockets = await io.in(room).fetchSockets();
  if(sockets.length < 2){
    return
  }
  let playerOne = sockets[0];
  let playerTwo = sockets[1]
  let gameRoom = playerOne.id + "_" + playerTwo.id;
  playerOne.leave(room);
  playerTwo.leave(room);
  playerOne.join(gameRoom);
  playerTwo.join(gameRoom);
  startGame(gameRoom)
}

async function startGame(gameRoom){
  let passage = await getPassage();
  io.to(gameRoom).emit('gameReady', passage)
  let countDownLength = 5;
  let countDown = setInterval(() => {
    if(countDownLength < 1){
      clearInterval(countDown)
    }
    io.to(gameRoom).emit('countdown', countDownLength)
    countDownLength--;
  }, 1000);
}


function getPassage(){
  return new Promise(function(resolve,reject){
    fs.readFile('passages.json', (err,data) =>{
      if(err){
        reject(err);
        return
      } 
      let passagesData = JSON.parse(data)
      resolve(passagesData.passages[Math.floor(Math.random() * passagesData.passages.length)]);
    })
  })
}
