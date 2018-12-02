module.exports = function(){

	var mysql = require('mysql');
	
	var conn = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'heybuddy01',
		database: 'alpha'
	});
	
	conn.connect();

	return conn;
}

