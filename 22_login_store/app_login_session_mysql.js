
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
	secret: '59s7xk22@&%xj2@st7',
	resave: false,	//	create new session id whenever user visits the site
	saveUninitialized: true,	//	do not issue session id before user connection
	store: new MySQLStore({		//	setting for storing session data into MySQL DB
		host:'localhost',
		port:3306,
		user:'root',
		password:'heybuddy01',
		database:'alpha'
	})
})
);

app.listen(3006, function(){
	console.log('Connected 3006 port!!!');
});

var user = {
	username: 'quanto',
	password: '111',
	nickname: 'Balup zergling'
};

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

	if(uname == user['username'] && pwd == user['password']){
		req.session.nickname = user['nickname'];	//	store user's nickname into session
		req.session.save(function(){
			res.redirect('/welcome');
		});
	}
	else{
		res.send('Incorrect user information. <a href="/auth/login">login</a>');
	}

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
