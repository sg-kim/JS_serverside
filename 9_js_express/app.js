// this file includes main entry point of this exercise project

var express = require('express');

var app = express();

app.set('view engine', 'jade');		//	setup to use 'jade' as a template engine
app.set('views', './views');	//	jade conventionally locates template files into 'views' directory

app.use(express.static('public'));	//	assign location 'public' in which static files are located

app.get('/template', function(req, res){	//	router to '/template' location
	res.render('temp');		//	load 'temp' template file
});

app.get('/', function(req, res){	//	router: connect to home(/) with GET method
	res.send('Hello home page');
});

app.get('/dynamic', function(req, res){
	var lis = '';
	for(var i = 0; i < 5; i++){
		lis = lis + '<li>coding</li>';
	}
	var time = Date();
	var output = `
	<html>
	<head>
		<meta charset="utf-8">
		<title></title>
	</head>
	<body>
		Hello, Dynamic!
		<ul>
			${lis}
		</ul>
		${time}
	</body>
	</html>`;
	res.send(output);
});

app.get('/login', function(req, res){	//	router: connect to login location(/login) with GET method
	res.send('<h1>Login please</h1>');
});

app.get('/book', function(req, res){	//	router: connect to location where static files are located with GET method
	res.send('Hello, blue book, <img src="/blue-book.png">');
});

app.listen(3000, function(){
	console.log('Connected 3000 port!');
});

