
module.exports = function(){

	var OrientDB = require('orientjs');
	
	var server = OrientDB({
		host: 'localhost',
		port: 2424,
		username: 'root',
		password: '8087'
	});

	var db = server.use('alpha');

	return db;
}
