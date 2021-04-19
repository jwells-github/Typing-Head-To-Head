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
    socket.to(socket.room).emit('word-send',currentPosition)
  })
  socket.on('complete', (timer) =>{
    io.emit('endRace', socket.id);
  })
  socket.on('findGame', (removeMe) =>{
    if(waiting.has(socket)){
      waiting.delete(socket)
      return; 
    }
    waiting.add(socket)
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
      getPassages()
        .then(data => 
        {
          io.to(room).emit('gameReady', data.passages[Math.floor(Math.random() * data.passages.length)])
        })
        .catch(err => {
          return
        })
    }
  })

  console.log('a user connected');
  socket.on("disconnect", () => {
    waiting.delete(socket)
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.get('/test', function (req,res) {
  getPassages()
    .then(data => 
      {
        return res.status(200).json(data.passages[Math.floor(Math.random() * data.passages.length)])
      })
    .catch(err => {return res.status(200).json({"error" : err})})
})

function getPassages(){
  return new Promise(function(resolve,reject){
    fs.readFile('passages.json', (err,data) =>{
      if(err){
        reject(err);
        return
      } 
      resolve(JSON.parse(data));
    })
  })
}
