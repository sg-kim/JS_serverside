
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

//	setting for handling static data
app.use(express.static('public_file'));

//	settings for handling dynamic files with Jade
app.set('view engine', 'jade');
app.set('views', './views_file');
app.locals.pretty = true;

//	use body parser to handle data from POST method
app.use(bodyParser.urlencoded({extended:false}));

//	waiting request from users
app.listen(3002, function(){
	console.log('connected to 3002 port!');
});

//	Routers
app.post('/topic', function(req, res){
	var title = req.body.title;
	var description = req.body.description;
	fs.writeFile('./data/'+title, description, 'utf8', function(err){
			res.redirect('/topic');
	});
});

app.get('/topic/new', function(req, res){
	res.render('new');
});

app.get('/topic', function(req, res){
	fs.readdir('data', function(err, files){
		res.render('index', {topics:files});
	});
});

app.get('/topic/:title', function(req, res){

});


