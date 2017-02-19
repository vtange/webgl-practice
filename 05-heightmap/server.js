var express = require('express');
var path = require('path');

var app = express();

//use static middleware in express to load static page directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

app.listen(4001,function(){
    console.log('The magic happens at port 4000.');
});