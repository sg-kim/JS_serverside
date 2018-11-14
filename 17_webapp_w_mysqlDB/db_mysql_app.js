
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();

var conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'heybuddy01',
	database: 'alpha'
});

app.set('view engine', 'jade');
app.set('views', './views_file');
app.locals.pretty = true;

app.use(bodyParser.urlencoded({extended:false}));

app.listen(3004, function(){
	console.log('connected to 3003 port!');
});

//	Routers

app.get('/topic/add', function(req, res){

});

app.post('/topic/add', function(req, res){

});

app.get(['/topic', '/topic/:id'], function(req, res){

var sql = 'SELECT * FROM topic';

conn.query(sql, function(err, rows, fields){
	if(err){
		console.log(err);
	}
	else{
		
	}
});



});

app.get('topic/:id/edit', function(req, res){

});

app.post('topic/:id/edit', function(req, res){

});

app.get('topic/:id/delete', function(req, res){

});

app.post('topic/:id/delete', function(req, res){

});

