
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var orientoStore = require('connect-oriento')(session);
var OrientDB = require('orientjs');

//	module for save session data into file
var fileStore = require('session-file-store')(session);

//	modules for password security, sha256 algorithm and pbkdf2 method
var sha256 = require('sha256');
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();

//	passport module, strategy and hash function for integrated login control
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;

var app = express();

var server = OrientDB({
	host: 'localhost',
	port: 2424,
	username: 'root',
	password: '8087'
});
var db = server.use('alpha');

app.set('view engine', 'jade');
app.set('views', './view_files');
app.locals.pretty = true;

app.use(bodyParser.urlencoded({extended:false}));

//	this app uses session method
app.use(session({
	secret: '2sxk589x#@0sklk@!kxj24',
	resave: false,
	saveUninitialized: true,
	store: new orientoStore({
		server: 'host=localhost&port=2424&username=root&password=8087&db=alpha'
	})
})
);

//	initialize passport
app.use(passport.initialize());
//	this app uses session function in the passport integrated login control
app.use(passport.session());

app.listen(3006, function(){
	console.log('connected to 3006 ports!');
});

passport.serializeUser(function(user, done){
	console.log('serializeUser', user);
	//done(null, user['username']);		//	store user name into a session
	done(null, user['authId']);		//	store user name into a session
});

//	this function is called whenever user visits new pages
passport.deserializeUser(function(id, done){
	console.log('deserializeUser', id);
	var sql = 'SELECT nickname FROM user WHERE authId:authId';
	db.query(sql, {params:{authId:id}}).then(function(results){
		if(results.length == 0){
			done('There is no user.');
		}
		else{
			done(null, results[0]);		//	hand over 'nickname'
		}
	});
	//for(var i = 0; i < users.length; i++){
	//	var user = users[i];
	//	//if(user['username'] == id){
	//	if(user['authId'] == id){
	//		//	done function creates or update req.user object, which include user specific data
	//		return done(null, user);
	//	}
	//}
	//done('No matching user.');
});

//	register local strategy for passport
passport.use(new localStrategy(
	function(username, password, done){
		var uname = username;
		var pwd = password;
		var user;
		var sql = 'SELECT * FROM user WHERE authId=:authId';

		db.query(sql, {
			params:{authId:'local:' + uname}
		}).then(function(results){
			if(results.length == 0){
				done(null, false);
			}

			user = results[0];

			return hasher({password:pwd, salt:user['salt']}, function(err, pass, salt, hash){
				if(hash == user['password']){
					console.log('LocalStrategy', user);
					done(null, user);
				}
				else{
					done(null, false);
				}
			});
		});

		//for(var i = 0; i < users.length; i++){
		//	user = users[i];

		//	if(uname == user['username']){
		//		return hasher({password:pwd, salt:user['salt']}, function(err, pass, salt, hash){
		//			if(hash == user['password']){
		//				console.log('localStrategy', user);
		//				done(null, user);	//	hand over user data to serializeUser function using done function
		//				//	cf.) done(err);		//	for error handling
		//			}
		//			else{
		//				done(null, false);
		//			}
		//		});
		//	}
		//}

		//done(null, false);		//	no matching user in the user list
	}
));

//	register passport strategy for passport
passport.use(new facebookStrategy({
	clientID: 'FACEBOOK_APP_ID',
	clientSecret: 'FACEBOOK_APP_SECRET',
	callbackURL: "/auth/facebook/callback",
	//profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
	},
	function(accessToken, refreshToken, profile, done){
		console.log(profile);
		var authId = 'facebook:' + profile['id'];
		var sql = 'SELECT nickname FROM user WHERE authId=:authId';

		db.query(sql, {params:{authId:authId}}).then(function(results){
			if(results.length == 0){
				var newuser = {
					'authId':authId,
					'nickname':profile['displayName']
					//, 'email': profile['emails'][0]['value']
					//, 'email': profile.emails[0].value
				}
				sql = 'INSERT INTO user (authId, nickName) VALUES (:authId, :nickName)';
				db.query(sql, {params:{authId:newuser['authId'], nickname:newuser['nickname']}}).then(function(results){
					done(null, newuser);
				}, function(error){
					console.log(error);
					done('Error');
				});
			}
			else{
				return done(null, results[0]);
			}
		});
	})
);

//	user data for exercise
var users = [
	{
		authId:'local:quanto',
		username: 'quanto',
		//password: '698d51a19d8a121ce581499d7b701668',
		password: 'ANMgKiCz/cCf8e++Iy6UgvRJzE+GfQz4y1H/vU5CTMzUqPfBIoA/+YKzVCZINCrLrbc3so6ladYQe/Pt9rZLoHbdktvgyrm9a0HxMlpV+er6KbrNUyyRdvYucIYh/TbXTR8uOyKo6QftjjbGYEBDqLEL0dL8fFxH5JqZjIDmfFE=',
		salt: 'xS3rRElmxeI5jMIp7OBc5ldYXRLFMRmPmBYbr0kcR07yfPlM7GK774fP52fcfSavkXfjn8ZrqMICzvWEYUcfbw==',
		nickname: 'Balup zergling'
	},
	{
		authId:'local:reizel',
		username: 'reizel',
		//password: '698d51a19d8a121ce581499d7b701668',
		password: 'kGPOd9BRF/qNI8mqThdQ4rteR05WUHdCUoB9WhZOINNDDOAie7XYJWEiZUv48Kv1Qx0XdcuyP1dbu2uhu/J58reoyVVX1E0Kcf63ymXbVdTSiyQ9eiGh1Z1YLigUM05pqXoZw76Ni/Ax6NuSvcE6AmKn5Ls8UAw7CGz0sxzsH+0=',
		salt: 'rv4i9pHiQ0OYuXj3T1qRHqOlsgsBTCI9CF6EfnYBrymX7bI1sCjzjKx5Lc2wiD7rl5vA5Gz31TRIvflCVnkU8A==',
		nickname: 'Balup zealot'
	}
];

//	Routers

app.get('/auth/login', function(req, res){
	res.render('auth/login');
});

//	execute 'local' strategy
//	'failureFlash': instant message that notifies login failure to a user
app.post('/auth/login', passport.authenticate('local', {
		successRedirect: '/welcome',
		failureRedirect: '/auth/login',
		failureFalsh: false
	})
);

//	execute 'facebook' strategy
app.get('/auth/facebook', passport.authenticate('facebook'));

//app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

//	FaceBook calls this url
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
	res.render('auth/register');
});

app.post('/auth/register', function(req, res){
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

		var sql = 'INSERT INTO user (authId, username, password, salt, nickname) VALUES(:authId, :username, :password, :salt, :nickname)'; 

		db.query(sql, {
			params:user
		}).then(function(results){
			req.login(user, function(err){
				req.session.save(function(){
					res.redirect('/welcome');
				});
			});
		}, function(error){
			console.log(error);
			res.status(500);
		});
	});
});


//app.get('/topic/add', function(req, res){
//	var sql = 'SELECT * FROM topic';
//
//	conn.query(sql, function(err, rows, fields){
//		if(err){
//			console.log(err);
//		}
//		else{
//			res.render('add', {topics:rows});
//		}
//	});
//});
//
//app.post('/topic/add', function(req, res){
//	var title = req.body.title;
//	var description = req.body.description;
//	var author = req.body.author;
//
//	var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
//
//	var params = [title, description, author];
//
//	conn.query(sql, params, function(err, row, field){
//		if(err){
//			console.log(err);
//			res.status(500).send('Internal Server Error');
//		}
//		else{
//			var id = row['insertID'];
//			res.redirect('/topic/' + id);
//		}
//	});
//});
//
//app.get(['/topic', '/topic/:id'], function(req, res){
//	var id = req.params.id;
//	var sql = 'SELECT * FROM topic';
//
//	if(id){
//		conn.query(sql, function(err, rows, fields){
//			if(err){
//				console.log(err);
//				res.status(500).send('Internal Server Error');
//			}
//			else{
//				sql = 'SELECT * FROM topic WHERE id=?';
//				params = [id];
//
//				conn.query(sql, params, function(err, row, fields){
//					if(err){
//						console.log(err);
//						res.status(500).send('Internal Server Error');
//					}
//					else{
//						res.render('view', {topics:rows, topic:row[0]});
//					}
//				});
//			}
//		});
//	}
//	else{
//		conn.query(sql, function(err, rows, fields){
//			if(err){
//				console.log(err);
//				res.status(500).send('Internal Server Error');
//			}
//			else{
//				res.render('view', {topics:rows});
//			}
//		});
//	}
//});
//
//app.get('/topic/:id/edit', function(req, res){
//	var id = req.params.id;
//	var sql = 'SELECT * FROM topic';
//
//	conn.query(sql, function(err, rows, fields){
//		if(err){
//			console.log(err);
//			res.status(500).send('Internal Server Error');
//		}
//		else{
//			sql = 'SELECT * FROM topic WHERE id=?';
//			var params = [id];
//
//			conn.query(sql, params, function(err, row, fields){
//				if(err){
//					console.log(err);
//					res.status(500).send('Internal Server Error');
//				}
//				else{
//					res.render('edit', {topics:rows, topic:row[0]});
//				}
//			});
//		}
//	});
//});
//
//app.post('/topic/:id/edit', function(req, res){
//	var id = req.params.id;
//	var title = req.body.title;
//	var description = req.body.description;
//	var author = req.body.author;
//
//	var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
//	var params = [title, description, author];
//
//	conn.query(sql, params, function(err, row, fields){
//		if(err){
//			console.log(err);
//			res.status(500).send('Internal Server Error');
//		}
//		else{
//			res.redirect('/topic/' + id);
//		}
//	});
//});
//
//app.get('/topic/:id/delete', function(req, res){
//	var id = req.params.id;
//	var sql = 'SELECT * FROM topic';
//
//	conn.query(sql, function(err, rows, fields){
//		if(err){
//			console.log(err);
//			res.status(500).send('Internal Server Error');
//		}
//		else{
//			sql = 'SELECT * FROM topic WHERE id=?';
//			var params = [id];
//			
//			conn.query(sql, params, function(err, row, fields){
//				if(err){
//					console.log(err);
//					res.status(500).send('Internal Server Error');
//				}
//				else{
//					res.render('delete', {topics:rows, topic:row[0]});
//				}
//			});
//		}
//	});
//});
//
//app.post('/topic/:id/delete', function(req, res){
//	var id = req.params.id;
//	var sql = 'DELETE FROM topic WHERE id=?';
//	var params = [id];
//
//	conn.query(sql, params, function(err, row, fields){
//		if(err){
//			console.log(err);
//			res.status(500).send('Internal Server Error');
//		}
//		else{
//			res.redirect('/topic');
//		}
//	});
//});



