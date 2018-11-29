
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var mysqlStore = require('express-mysql-session')(session);

var sha256 = require('sha256');
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;

var app = express();

var conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'heybuddy01',
	database: 'alpha'
});

conn.connect();

app.set('view engine', 'jade');
app.set('views', './view_files');
app.locals.pretty = true;

app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
	secret: '2skj2@#sjjsoi@!jso53s',
	resave: false,
	saveUninitialized: true,
	store: new mysqlStore({
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: 'heybuddy01',
		database: 'alpha'
	})
})
);

app.use(passport.initialize());

app.use(passport.session());

app.listen(3006, function(){
	console.log('connected to 3006 ports!');
});

// serializer and deserializer for managing session

passport.serializeUser(function(user, done){
	console.log('serializeUser', user);
	done(null, user['authId']);
});

passport.deserializeUser(function(id, done){
	console.log('deserializeUser', id);

	var sql = 'SELECT nickname FROM users WHERE authId=?';
	var params = [id];

	conn.query(sql, params, function(err, row, fields){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		else{
			//console.log(row);
			//console.log(row[0]);
			//console.log(row[0]['nickname']);
			var user = row[0];

			//if(user){
			if(row.length > 0){
				return done(null, row[0]);
			}
			else{
				return done(null, false);
			}
		}
	});
});

// authentication strategies

passport.use(new localStrategy(
		function(username, password, done){
			var uname = username;
			var pwd = password;
			var user;

			var sql = 'SELECT * FROM users WHERE username=?';
			var params = [uname];

			conn.query(sql, params, function(err, row, fields){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error');
				}
				else{
					user = row[0];

					//if(user){
					if(row.length > 0){
						return hasher({password:pwd, salt:user['salt']}, function(err, pass, salt, hash){
							if(hash == user['password']){
								console.log('localStrategy', user);
								done(null, user);
							}
							else{
								done(null, false);
							}
						});
					}
					else{
						done(null, false);	//	no matching user in the DB
					}
				}
			});
		}
	)
);

passport.use(new facebookStrategy({
		clientID: FACEBOOK_APP_ID,
		clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: "/auth/facebook/callback",
		//profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
		}, 
		function(accessToken, refreshToken, profile, done){
			console.log(profile);
			var authId = 'facebook: ' + profile['id'];

			var sql = 'SELECT authId, nickname FROM users WHERE authId=?';
			var params = [authId];

			conn.query(sql, params, function(err, row, fields){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error');
				}
				else{
					var user = row[0];
					//if(user){
					if(row.length > 0){
						done(null, user);
					}
					else{
						user = {
							'authId': authId,
							'nickname': profile['displayName']
						}
						
						sql = 'INSERT INTO users (authId, nickname) VALUES(?, ?)';
						params = [user['authId'], user['nickname']];

						conn.query(sql, params, function(err, row, fields){
							if(err){
								console.log(err);
								res.status(500).send('Internal Server Error');
								done('Error');
							}
							else{
								done(null, user);
							}
						});
					}
				}
			});
		}
	)
);

// Routers

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
		<p>
			<a href="/auth/register">register</a>
		</p>
		<p>
			<a href="/auth/facebook">Facebook</a>
		</p>
	`;

	res.send(output);
});

//	execute 'local' strategy
app.post('/auth/login', passport.authenticate('local', {
		successRedirect: '/welcome',
		failureRedirect: '/auth/login',
		failureFalsh: false
	})
);

//	execute 'facebook' strategy
app.get('/auth/facebook', passport.authenticate('facebook'));

//	FaceBook calls this url during executing 'facebook' strategy
app.get('/auth/facebook/callback', passport.authenticate(
		'facebook', {
				successRedirect: '/welcome',
				failureRedirect: '/auth/login'
		})
);

app.get('/welcome', function(req, res){
	// passport module creates 'user' object in the 'req' object after doing 'local' strategy
	// the req.user comes from 'done(null, user)' in the deserializeUser function
	if(req.user && req.user.nickname){
		console.log('/welcome - login success');
		res.send(`
			<h1>Hello, ${req.user.nickname}</h1>
			<a href="/auth/logout">Logout</a>
		`);
	}
	else{
		console.log('/welcome - login fails');
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
	req.logout();
	req.session.save(function(){
		res.redirect('/welcome');
	});
});

app.get('/auth/register', function(req, res){
	var output = `
		<h1>Register</h1>
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
	var authId = 'local:' + req.body.username;
	var uname = req.body.username;
	var passwd = req.body.password;
	var nickname = req.body.nickname;

	hasher({password:passwd}, function(err, pass, salt, hash){
		var user = {
			authId:'local:' + req.body.username,
			username:uname,
			password:hash,
			salt:salt,
			nickname:nickname
		};

		var sql = 'INSERT INTO users (authId, username, password, salt, nickname) VALUES(?, ?, ?, ?, ?)';
		var params = [user['authId'], user['username'], user['password'], user['salt'], user['nickname']];

		conn.query(sql, params, function(err, row, fields){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error');
			}
			else{
				req.login(user, function(err){
					req.session.save(function(){
						res.redirect('/welcome');
					});
				});
			}
		});

	});
});



