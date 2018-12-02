
module.exports = function(express){

	//var express = require('express');
	var p2 = express.Router();
	
	p2.get('/r1', function(req, res){
		res.send('Hello, /p2/r1');
	});
	p2.get('/r2', function(req, res){
		res.send('Hello, /p2/r2');
	});

	return p2;
}

