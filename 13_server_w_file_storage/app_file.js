
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
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		res.redirect('/topic');
	});
});

app.get('/topic', function(req, res){
	fs.readdir('data', function(err, files){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		res.render('view', {topics:files});
	});
});

app.get('/topic/new', function(req, res){
	res.render('new');
});

app.get('/topic/:id', function(req, res){
	var id = req.params.id;
	fs.readdir('data', function(err, files){

		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}

		fs.readFile('data/'+id, 'utf8', function(err, data){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error');
			}
			res.render('view', {topics:files, title:id, description:data});
		});
	});
});

