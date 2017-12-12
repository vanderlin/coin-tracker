var config = require('./config');
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');

// create the express app
var app = express();

app.use(express.static(path.join(__dirname, 'dist'))); //  "public" off of current is root

app.get('*', function(req,res){
	res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

// kick of the app
var port = process.env.PORT || 5000;
app.listen(port);

console.log(`Node Env: ${process.env}`);
console.log(`server started on port: ${port}`);