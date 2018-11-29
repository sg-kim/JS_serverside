
var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.set('views', 'jade');

// Routers

app.get('/view', function(req, res){
	res.render('view');
});

app.get('/add', function(req, res){
	res.render('add');
});

app.listen(3007, function(){
	console.log('Connect 3007 port!');	
});

