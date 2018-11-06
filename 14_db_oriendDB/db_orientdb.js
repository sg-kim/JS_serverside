
// configure the client(server program is a client at the perspective of DB)
var orientDB = require('orientjs');

var server = orientDB({
	host: 'localhost',		//	describe location of DB
	port: 2424,
	username: 'root',
	password: '8087'
});

var db = server.use('alpha');	//	designate DB

//db.record.get('#22:0').then(function(record){
//	console.log('Loaded record: ', record.title);
//});

//	Create

var sql = 'SELECT * FROM topic WHERE @rid=:rid';
var param = {
	params:{
		rid:'#22:0'
	}
};
db.query(sql, param).then(function(results){
	console.log(results);
});

