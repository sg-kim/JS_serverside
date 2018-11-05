
var express = require('express');

var app = express();

var bodyParser = require('body-parser');

app.listen(3001, function(){
	console.log('Connected to 3001 port!');
});

//	Handling static files
app.use(express.static('public'));		//	assign location 'public', in which static files are located

//	Handling dynamic files using Jade
app.set('view engine', 'jade');		//	using 'jade' as a view engine
app.set('views', './views');	//	assign a location, in which view files are located
app.locals.pretty = true;	//	show html code which are made by jade with indentation

//	Set bodyParser as a data parsing middleware(all data pass this 'middle' ware)
app.use(bodyParser.urlencoded({extended:false}));

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

//app.get('/topic', function(req, res){	//	handling query string
//	var topics = [
//		'Javascript is...',
//		'Nodejs is...',
//		'Express is...'
//	];
//	var output = `
//		<a href="/topic?id=0">JavaScript</a><br>
//		<a href="/topic?id=1">Nodejs</a><br>
//		<a href="/topic?id=2">Express</a><br><br>
//		${topics[req.query.id]}
//	`
//	res.send(output);
//});

//app.get('/topic/:id', function(req, res){	//	handling semantic URL #1
//	var topics = [
//		'Javascript is...',
//		'Nodejs is...',
//		'Express is...'
//	];
//	var output = `
//		<a href="/topic/0">JavaScript</a><br>
//		<a href="/topic/1">Nodejs</a><br>
//		<a href="/topic/2">Express</a><br><br>
//		${topics[req.params.id]}
//	`
//	res.send(output);
//});

app.get('/topic/:id/:mode', function(req, res){	//	handling semantic URL #2
	res.send(req.params.id+', '+req.params.mode);
});

app.get('/form', function(req, res){
	res.render('form');	
});

app.get('/form_receiver', function(req, res){	//	acquiring user transderred data via GET method
	var title = req.query.title;
	var description = req.query.description;
	res.send(title + ', ' + description);
});

app.post('/form_receiver', function(req, res){	//	handling user transferred data via POST method
	var title = req.body.title;		//	body parser create 'body' object into 'req' object
	var description = req.body.description;
	res.send(title + ', ' + description);
});


