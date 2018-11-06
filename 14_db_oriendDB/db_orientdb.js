
// configure the client(server program is a client at the perspective of DB)
var orientDB = require('orientjs');

var server = orientDB({
	host: 'localhost',
	port: 2424,
	username: 'root',
	password: '8087'
});

