
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var md5 = require('md5');

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
	secret: '59s7xk22@&%xj2@st7',
	resave: false,	//	create new session id whenever user visits the site
	saveUninitialized: true,	//	do not issue session id before user connection
	store: new fileStore()	//	option for store session data into file
})
);

app.listen(3006, function(){
	console.log('Connected 3006 port!!!');
});

var users = [
	{
		username: 'quanto',
		//password: '698d51a19d8a121ce581499d7b701668',
		password: '25539ea39dfc3e135a2147ac8770bdf8',
		salt: '29xwwic2@3&@s10sfacv',
		nickname: 'Balup zergling'
	},
	{
		username: 'reizel',
		//password: '698d51a19d8a121ce581499d7b701668',
		password: 'a4e895304edb140f29cd84113dbce10a',
		salt: 'xjlksad&@*$##$ksdjlawi',
		nickname: 'Balup zealot'
	}
];

app.get('/auth/login', function(req, res){
	var output = `
		<h1>Login</h1>
		<form action="/auth/login" method="post">
			<p>
				<input type="text" name="username" placeholder="username">
			</p>
			<p>
				<input type="password" name="password" placeholder="password">
			</p>
			<p>
				<input type="submit">
			</p>
		</form>
	`;

	res.send(output);
});

app.post('/auth/login', function(req, res){
	var uname = req.body.username;
	var pwd = req.body.password;
	var user;

	for(var i = 0; i < users.length; i++){

		user = users[i];

		if(uname == user['username'] && md5(pwd + user['salt']) == user['password']){
			req.session.nickname = user['nickname'];	//	store user's nickname into session
			return req.session.save(function(){		//	return(exit from 'app.post') if a user matches
				res.redirect('/welcome');
			});
		}
	}

	res.send('Incorrect user information. <a href="/auth/login">login</a>');
});

app.get('/welcome', function(req, res){
	//res.send(req.session);
	if(req.session.nickname){
		res.send(`
			<h1>Hello, ${req.session.nickname}</h1>
			<a href="/auth/logout">Logout</a>
		`);
	}
	else{
		res.send(`
			<h1>Welcome</h1>
			<a href="/auth/login">Login</a>
		`);
	}
});

app.get('/auth/logout', function(req, res){
	delete req.session.nickname;
	req.session.save(function(){
		res.redirect('/welcome');
	});
});

