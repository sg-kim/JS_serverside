
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

conn.connect();

app.set('view engine', 'jade');
app.set('views', './view_files');
app.locals.pretty = true;

app.use(bodyParser.urlencoded({extended:false}));

app.listen(3006, function(){
	console.log('connected to 3006 ports!');
});

app.get('/topic/add', function(req, res){
	var sql = 'SELECT * FROM topic';

	conn.query(sql, function(err, rows, fields){
		if(err){
			console.log(err);
		}
		else{
			res.render('add', {topics:rows});
		}
	});
});

app.post('/topic/add', function(req, res){
});
