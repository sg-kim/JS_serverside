
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

//var param = {
//	params:{
//		rid:'#22:0'
//	}
//};
//db.query(sql, param).then(function(results){
//	console.log(results);
//});

//	INSERT

//sql = 'INSERT INTO topic (title, description) VALUES(:title, :desc)';
//
//var param = {
//	params:{
//		title:'Express',
//		desc:'Express is ...'
//	}
//};
//
//db.query(sql, param).then(function(results){
//	console.log(results);
//});

//	UPDATE

//sql = 'UPDATE topic SET title=:title WHERE @rid=:rid';
//
//var param = {
//	params:{
//		title:'Expressjs',
//		rid:'#21:1'
//	}
//};
//
//db.query(sql, param).then(function(results){
//	console.log(results);
//});

//	DELETE

sql = 'DELETE FROM topic WHERE @rid=:rid';

var param = {
	params:{
		rid:'#21:1'
	}
}

db.query(sql, param).then(function(results){
	console.log(results);
});


