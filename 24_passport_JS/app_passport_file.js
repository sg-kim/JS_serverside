
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var sha256 = require('sha256');
var bkfd2Password = require('pbkdf2-password');

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

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
app.use(passport.initialize());
app.use(passport.session());	//	use 'session' method when using passport

app.listen(3006, function(){
	console.log('Connected 3006 port!!!');
});

passport.serializeUser(function(user, done){	//	'done(null, user)' runs this routine
	console.log('serializeUser', user);
	done(null, user['username']);	//	store 'username' into a session
});

passport.deserializeUser(function(id, done){	//	runs whenever user visits each page with session data
	console.log('deserializeUser', id);
	for(var i = 0; i < users.length; i++){
		var user = users[i];
		if(user['username'] == id){
			return done(null, user);
		}
	}
	//User.findById(id, function(err, user){
	//	done(err, user);
	//});
});

passport.use(new localStrategy(		//	registrate 'local' Strategy
	function(username, password, done){
		var uname = username;
		var pwd = password;
		var user;
		
		for(var i = 0; i < users.length; i++){
		
			user = users[i];
		
			if(uname == user['username']){
				return hasher({password:pwd, salt:user['salt']}, function(err, pass, salt, hash){
					if(hash == user['password']){
						console.log('localStrategy', user);
						done(null, user);
						//	cf.) done(err);		//	for error handling
						//req.session.nickname = user.nickname;
						//req.session.save(function(){
						//	res.redirect('/welcome');
						//});
					}
					else{
						done(null, false);
						//res.send('Incorrect user information. <a href="/auth/login">login</a>');
					}
				});
			}
		}
		
		done(null, false);
		//res.send('Incorrect user information. <a href="/auth/login">login</a>');
	}
));

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

//app.post('/auth/login', function(req, res){
//	var uname = req.body.username;
//	var pwd = req.body.password;
//	var user;
//
//	for(var i = 0; i < users.length; i++){
//
//		user = users[i];
//
//		if(uname == user['username']){
//			return hasher({password:pwd, salt:user['salt']}, function(err, pass, salt, hash){
//				if(hash == user['password']){
//					req.session.nickname = user.nickname;
//					req.session.save(function(){
//						res.redirect('/welcome');
//					});
//				}
//				else{
//					res.send('Incorrect user information. <a href="/auth/login">login</a>');
//				}
//			});
//		}
//	}
//
//	res.send('Incorrect user information. <a href="/auth/login">login</a>');
//});

app.post('/auth/login', passport.authenticate('local', {	//	execute 'local' Strategy
	sucessRedirect: '/welcome',
	failureRedirect: '/auth/login',
	failureFlash: false		//	give one time message to user
	}),
	function(req, res){
//		console.log('app.post - /auth/login');
		res.redirect('/welcome');
	}
);

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
			<p>
				<a href="/auth/login">Login</a>
			</p>
			<p>
				<a href="/auth/register">Register</a>
			</p>
		`);
	}
});

app.get('/auth/logout', function(req, res){
	delete req.session.nickname;
	req.session.save(function(){
		res.redirect('/welcome');
	});
});

app.get('/auth/register', function(req, res){
	var output = `
		<h1>Login</h1>
		<form action="/auth/register" method="post">
			<p>
				<input type="text" name="username" placeholder="username">
			</p>
			<p>
				<input type="password" name="password" placeholder="password">
			</p>
			<p>
				<input type="text" name="nickname" placeholder="nickname">
			</p>
			<p>
				<input type="submit">
			</p>
		</form>
	`;

	res.send(output);
});

app.post('/auth/register', function(req, res){
	var uname = req.body.username;
	var passwd = req.body.password;
	var nickname = req.body.nickname;

	hasher({password:passwd}, function(err, pass, salt, hash){
		var user ={
			username:uname,
			password:hash,
			salt:salt,		//	'salt' is created automatically
			nickname:nickname
		};
		users.push(user);
	
		console.log(users);

		for(var i = 0; i < users.length; i++){
			console.log(users[i]);
		}

		res.redirect('/welcome');
	});
});

