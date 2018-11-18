
var express = require('express');
var session = require('express-session');

var app = express();

app.use(session({
	secret: '59s7xk22@&%xj2@st7',
	resave: false,	//	create new session id whenever user visits the site
	saveUninitialized: true		//	do not issue session id before user connection
})
);

app.listen(3006, function(){
	console.log('Connected 3006 port!!!');
});

app.get('/count', function(req, res){
	
	if(req.session.count){
		req.session.count++;
	}
	else{
		req.session.count = 1;
	}
	
	res.send('count: ' + req.session.count);
});

