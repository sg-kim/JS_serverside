
module.exports = function(express){

	var p1 = express.Router();

	p1.get('/r1', function(req, res){
		res.send('Hello, /p1/r1');
	});
	p1.get('/r2', function(req, res){
		res.send('Hello, /p1/r2');
	});

	return p1;
}

