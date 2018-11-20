
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var sha256 = require('sha256');
var bkfd2Password = require('pbkdf2-password');

var app = express();
var hasher = bkfd2Password();

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
		password: 'ANMgKiCz/cCf8e++Iy6UgvRJzE+GfQz4y1H/vU5CTMzUqPfBIoA/+YKzVCZINCrLrbc3so6ladYQe/Pt9rZLoHbdktvgyrm9a0HxMlpV+er6KbrNUyyRdvYucIYh/TbXTR8uOyKo6QftjjbGYEBDqLEL0dL8fFxH5JqZjIDmfFE=',
		salt: 'xS3rRElmxeI5jMIp7OBc5ldYXRLFMRmPmBYbr0kcR07yfPlM7GK774fP52fcfSavkXfjn8ZrqMICzvWEYUcfbw==',
		nickname: 'Balup zergling'
	},
	{
		username: 'reizel',
		//password: '698d51a19d8a121ce581499d7b701668',
		password: 'kGPOd9BRF/qNI8mqThdQ4rteR05WUHdCUoB9WhZOINNDDOAie7XYJWEiZUv48Kv1Qx0XdcuyP1dbu2uhu/J58reoyVVX1E0Kcf63ymXbVdTSiyQ9eiGh1Z1YLigUM05pqXoZw76Ni/Ax6NuSvcE6AmKn5Ls8UAw7CGz0sxzsH+0=',
		salt: 'rv4i9pHiQ0OYuXj3T1qRHqOlsgsBTCI9CF6EfnYBrymX7bI1sCjzjKx5Lc2wiD7rl5vA5Gz31TRIvflCVnkU8A==',
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

		if(uname == user['username']){
			return hasher({password:pwd, salt:user['salt']}, function(err, pass, salt, hash){
				if(hash == user['password']){
					req.session.nickname = user.nickname;
					req.session.save(function(){
						res.redirect('/welcome');
					});
				}
				else{
					res.send('Incorrect user information. <a href="/auth/login">login</a>');
				}
			});
		}
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

