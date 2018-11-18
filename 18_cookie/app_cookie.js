
var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();

app.use(cookieParser('48d8&$sjvi21@7'));

app.listen(3005, function(){
	console.log('connected to 3005 port!');
});

app.get('/count', function(req, res){
	
	//if(req.cookies.count){
	//	var count = parseInt(req.cookies.count);
	//}
	if(req.signedCookies.count){
		var count = parseInt(req.signedCookies.count);
	}
	else{
		var count = 0;
	}
	count = count + 1;
	
	//res.cookie('count', count);		//	set count cookie member to count + 1
	res.cookie('count', count, {signed:true});		//	set count cookie member to count + 1
	res.send('count : ' + count);
});

