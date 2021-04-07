const express = require("express");
const PORT = process.env.PORT || 8080;
const app = express();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get('/test', function (req,res) {
  return res.status(200).json({'words':'The rain in spain falls mostly on the plain'})
})