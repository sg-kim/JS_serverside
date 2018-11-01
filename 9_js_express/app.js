// this file includes main entry point of this exercise project

var express = require('express');

var app = express();

app.use(express.static('public'));	//	assign location 'public' in which static files are located

app.get('/', function(req, res){	//	connect to home(/) with GET method
	res.send('Hello home page');
});

app.get('/login', function(req, res){	//	connect to login location(/login) with GET method
	res.send('<h1>Login please</h1>');
});

app.get('/book', function(req, res){	//	connect to location where static files are located with GET method
	res.send('Hello, blue book, <img src="/blue-book.png">');
});

app.listen(3000, function(){
	console.log('Connected 3000 port!');
});

