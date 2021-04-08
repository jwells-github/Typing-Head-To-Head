const { json, response } = require("express");
const express = require("express");
const PORT = process.env.PORT || 8080;
const app = express();
const fs = require('fs');

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


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get('/test', function (req,res) {
  getPassages()
    .then(data => 
      {
        return res.status(200).json(data.passages[Math.floor(Math.random() * data.passages.length)])
      })
    .catch(err => {return res.status(200).json({"error" : err})})
})