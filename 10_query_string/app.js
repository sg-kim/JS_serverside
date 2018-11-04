
var express = require('express');

var app = express();

app.listen(3001, function(){
	console.log('Connected to 3001 port!');
});

//	Handling static files
app.use(express.static('public'));		//	assign location 'public', in which static files are located

//	Handling dynamic files using Jade
app.set('view engine', 'jade');		//	using 'jade' as a view engine
app.set('views', './views');	//	assign a location, in which view files are located
app.locals.pretty = true;	//	show html code which are made by jade with indentation

//	Routers

app.get('/', function(req, res){
	res.send('Hello, home page exercise');
});

app.get('/login', function(req, res){
	res.send('<h1>Login please</h1>');
});

app.get('/book', function(req, res){	//	static file location = './public'
	res.send('Hello, blue book, <img src="/blue-book.png">');
});

app.get('/template', function(req, res){
	res.render('temp', {time:Date(), _title:'Jade'});	//	render 'temp.jade' file with two arguments time and _title.
});

app.get('/topic', function(req, res){	//	handling query string
	var topics = [
		'Javascript is...',
		'Nodejs is...',
		'Express is...'
	];
	var output = `
		<a href="/topic?id=0">JavaScript</a><br>
		<a href="/topic?id=1">Nodejs</a><br>
		<a href="/topic?id=2">Express</a><br><br>
		${topics[req.query.id]}
	`
	res.send(output);
});

