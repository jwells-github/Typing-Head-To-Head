const express = require("express");
const PORT = process.env.PORT || 8080;
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');

const PUBLIC_WAITING_ROOM = 'publicWaitingRoom'
const MATCHMAKING_ROOM_SUFFIX = '-MATCHMAKING';
let numberOfUsersInPublicRoom;

const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

io.on('connection', (socket) => { 
  socket.wins = 0;
  socket.losses = 0;
  socket.recordWPM = 0;
  socket.on('setUsername', (username) =>{
    socket.username = username;
    socket.join(PUBLIC_WAITING_ROOM);
    numberOfUsersInPublicRoom = io.sockets.adapter.rooms.get(PUBLIC_WAITING_ROOM).size
    io.in(PUBLIC_WAITING_ROOM).emit('publicRoomSize', numberOfUsersInPublicRoom)
  })
  // A user in a race completes a word
  socket.on('wordComplete', (currentPosition) =>{
    socket.to(socket.gameRoom).emit('updateOpponentPosition',currentPosition)
  })
  // A user in a race completes all their words
  socket.on('raceComplete', () => {
    io.emit('endRace', socket.id);
  })
  socket.on('raceStats', (raceWPM,isRaceWinner) =>{
    socket.recordWPM = raceWPM > socket.recordWPM ? raceWPM : socket.recordWPM;
    isRaceWinner ? socket.wins++ : socket.losses++
  })
  socket.on('joinPrivateRoom', (privateRoom) =>{
    socket.leave(PUBLIC_WAITING_ROOM);
    socket.leave(PUBLIC_WAITING_ROOM+MATCHMAKING_ROOM_SUFFIX)
    socket.join(privateRoom);
    io.in(privateRoom).emit('privateRoomSize', io.sockets.adapter.rooms.get(privateRoom).size)
  })
  socket.on('leavePrivateRoom', (privateRoom) =>{
    socket.join(PUBLIC_WAITING_ROOM);
    socket.leave(privateRoom);
  })
  socket.on('soloGame', () => {
    socket.leave(PUBLIC_WAITING_ROOM+MATCHMAKING_ROOM_SUFFIX)
    let gameData = {
      playerOne: {
        id: socket.id,
        username: socket.username,
        recordWPM: socket.recordWPM,
        winLoss:  socket.wins + " Wins : " + socket.losses + " Losses"
      },
      playerTwo: {      
        id: '',
        username: '',
        recordWPM: '',
        winLoss:  ''
      }
    }
    startGame(socket.id, gameData)
  })
  socket.on('toggleMatchmaking', (roomName) =>{
    let room = roomName === '' ? PUBLIC_WAITING_ROOM : roomName;
    room += MATCHMAKING_ROOM_SUFFIX
    // If already in queue, leave
    if(socket.rooms.has(room)){
      socket.leave(room)
      socket.emit('inWaiting', false)
      return;
    }
    else{
      socket.emit('inWaiting', true)
      socket.join(room)
      matchUsers(room)
    }
  })
  socket.on('sendChatMessage', (username,chatMessage,roomName) =>{
    if(roomName === ''){
      socket.to(PUBLIC_WAITING_ROOM).emit('updatePublicChat',username, chatMessage);
    }
    else{
      socket.to(roomName).emit('updatePrivateChat',username, chatMessage);
    }
    
  })
  socket.on("disconnect", () => {
    if(socket.username != null){
      numberOfUsersInPublicRoom --;
      io.in(PUBLIC_WAITING_ROOM).emit('publicRoomSize', numberOfUsersInPublicRoom)
    }
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

async function matchUsers(room){
  let sockets = await io.in(room).fetchSockets();
  if(sockets.length < 2){
    // Not enough players in the queue to start a game
    return
  }
  let playerOne = sockets[0];
  let playerTwo = sockets[1];
  // Remove the players from the queue
  playerOne.leave(room);
  playerTwo.leave(room);
  // Add players to a gameroom 
  let gameRoom = playerOne.id + "_" + playerTwo.id;
  playerOne.join(gameRoom);
  playerTwo.join(gameRoom);
  playerOne.gameRoom = gameRoom;
  playerTwo.gameRoom = gameRoom;

  let gameData = {
    playerOne: {
      id: playerOne.id,
      username: playerOne.username,
      recordWPM: playerOne.recordWPM,
      winLoss:  playerOne.wins + " Wins : " + playerOne.losses + " Losses"
    },
    playerTwo: {      
      id: playerTwo.id,
      username: playerTwo.username,
      recordWPM: playerTwo.recordWPM,
      winLoss:  playerTwo.wins + " Wins : " + playerTwo.losses + " Losses"
    }
  }
  startGame(gameRoom, gameData)
}

async function startGame(gameRoom, gameData){
  let passage = await getPassage();
  gameData.passage = passage
  io.to(gameRoom).emit('gameReady', gameData)
  // Countdown timer to synchronise the start of the game
  let countDownLength = 4;
  let countDown = setInterval(() => {
    if(countDownLength < 1){
      clearInterval(countDown)
    }
    io.to(gameRoom).emit('countdown', countDownLength)
    countDownLength--;
  }, 1000);
}

// Return a random passage from passage.json
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
