var mysql = require('mysql');

var conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'heybuddy01',
	database: 'alpha'
});

conn.connect();

var sql = 'SELECT * FROM topic';

conn.query(sql, function(err, rows, fields){
	if(err){
		console.log(err);
	}
	else{
		for(var i = 0; i < rows.length; i++){
			console.log(rows[i]['title']);
			console.log(rows[i]['description']);
			console.log(rows[i]['author']);
		}
	}
});

////sql = 'INSERT INTO topic (title, description, author) VALUES("Nodejs", "Server side javascript", "quanto")';
//sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
//
//var params = ['NPM', 'Nodejs package manager', 'quanto'];
//
//conn.query(sql, params, function(err, rows, fields){
//	if(err){
//		console.log(err);
//	}
//	else{
//		console.log(rows);
//		console.log(rows.insertId);
//	}
//});

//sql = 'UPDATE topic SET title=?, author=? WHERE id=?';
//
//var params = ['npm', 'reizel', 4];
//
//conn.query(sql, params, function(err, rows, fields){
//	if(err){
//		console.log(err);
//	}
//	else{
//		console.log(rows);
//		//console.log(rows.insertId);
//	}
//});

sql = 'DELETE FROM topic WHERE id=?';

var params = [4];

conn.query(sql, params, function(err, rows, fields){
	if(err){
		console.log(err);
	}
	else{
		console.log(rows);
		//console.log(rows.insertId);
	}
});


conn.end();

