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
		console.log('rows', rows);
		console.log('fields', fields);
	}
});

conn.end();

