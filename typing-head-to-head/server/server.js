const { json, response } = require("express");
const express = require("express");
const PORT = process.env.PORT || 8080;
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');

var waiting = new Set(); 

io.on('connection', (socket) => { 
  socket.on('word', (currentPosition) =>{
    socket.to(socket.room).emit('updateOpponentPosition',currentPosition)
  })
  socket.on('complete', (timer) =>{
    io.emit('endRace', socket.id);
  })
  socket.on('soloGame', function(){
    getPassage().then(data =>{
      socket.emit('gameReady', data)
      let countDownLength = 5;
      let countDown = setInterval(() => {
        if(countDownLength < 1){
          clearInterval(countDown)
        }
        socket.emit('countdown', countDownLength)
        countDownLength--;
      }, 1000);
    })
  })
  socket.on('findGame', function() {
    if(waiting.has(socket)){
      waiting.delete(socket)
      socket.emit('inWaiting', false)
      return; 
    }
    waiting.add(socket) 
    socket.emit('inWaiting', true)
    if(waiting.size > 1){
      let iterator = waiting.values()
      let playerOne = iterator.next().value;
      let playerTwo = iterator.next().value;
      waiting.delete(playerOne);
      waiting.delete(playerTwo);
      let room = playerOne.id + "_" + playerTwo.id;
      playerOne.room = room;
      playerTwo.room = room;
      playerOne.join(room);
      playerTwo.join(room);
      getPassage().then(data => {
        io.to(room).emit('gameReady', data)
        let countDownLength = 5;
        let countDown = setInterval(() => {
          if(countDownLength < 1){
            clearInterval(countDown)
          }
          io.to(room).emit('countdown', countDownLength)
          countDownLength--;
        }, 1000);
      })
      .catch(err => {
        return
      })
    }
  })
  socket.on("disconnect", () => {
    waiting.delete(socket)
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

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
