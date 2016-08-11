const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('ImageSearch app listening on port 8080!');
});