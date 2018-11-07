
var express = require('express');
var bodyParser = require('body-parser');
var orientDB = require('orinetjs');

var app = express();

var server = orientDB({
	host: 'localhost',
	port: 2424,
	username: 'root',
	password: '8087'
});

var db = server.use('alpha');

app.set('view engine', 'jade');
app.set('views', './views_file');
app.locals.pretty = true;

app.use(bodyParser.urlencoded({extended:false}));

app.listen(3003, function(){
	console.log('connected to 3003 port!');
});

//	Routers

app.get(['topic', '/topic/:id'], function(req, res){
	var id = req.params.id;
	
	if(id){
		res.render('view', {});
	}
	else{
		res.render('view', {});
	}
});

app.get('topic/add', function(req, res){
	
	res.render('add', {});
});

app.post('topic/add', function(req, res){
	var title = req.body.title;
	var description = req.body.description;
	
	var sql = 'INSERT INTO topic (title, description) VALUES(:title, :desc)';
	
	var param = {
		params {
			title: ${title},
			description: ${description};
		}
	};

	db.query(sql, param).then(function(results){
		console.log(results);
		res.redirect('topic/' + title);
	}
});

app.get('topic/:id/edit', function(req, res){
	
	res.render('edit', {});
});

app.post('topic/:id/edit', function(req, res){
	
	var title = req.body.title;
	var desc = req.body.description;
	var id = ;
	
	var sql = 'UPDATE topic SET title=:title description=:desc WHERE @rid=:rid';

	var param = {
		params:{
			title:${title},
			description:${desc},
			rid: ${}
		}
	};

	db.query(sql, param).then(function(results){
		console.log(results);
		res.redirect('/topic/' + title);
	});
});

app.get('topic/:id/delete', function(req, res){
	
	var id = req.params.id;
	
	res.render('delete', {});
});

app.post('topic/:id/delete', function(req, res){
	
	var sql = 'DELETE FROM topic WHERE @rid=rid';

	var param = {
		params:{
			rid: ${id}
		}
	}
	
	db.query(sql, param).then(function(result){
		console.log(results);
		res.redirect('topic/');
	});
});

