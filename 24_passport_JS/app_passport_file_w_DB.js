
var express = require('express');
var bodyParser = require('body-parser');
//var mysql = require('mysql');
var session = require('express-session');
var mysqlStore = require('express-mysql-session')(session);

//	module for save session data into file
var fileStore = require('session-file-store')(session);

//	modules for password security, sha256 algorithm and pbkdf2 method
var sha256 = require('sha256');
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();

//	passport module, strategy and hash function for integrated login control
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var app = express();

//var conn = mysql.createConnection({
//	host: 'localhost',
//	user: 'root',
//	password: 'heybuddy01',
//	database: 'alpha'
//});
//
//conn.connect();

app.set('view engine', 'jade');
app.set('views', './view_files');
app.locals.pretty = true;

app.use(bodyParser.urlencoded({extended:false}));

//	this app uses session method
app.use(session({
	secret: '2sxk589x#@0sklk@!kxj24',
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

//	initialize passport
app.use(passport.initialize());
//	this app uses session function in the passport integrated login control
app.use(passport.session());

app.listen(3006, function(){
	console.log('connected to 3006 ports!');
});

passport.serializeUser(function(user, done){
	console.log('serializeUser', user);
	done(null, user['username']);		//	store user name into a session
});

//	this function is called whenever user visits new pages
passport.deserializeUser(function(id, done){
	console.log('deserializeUser', id);
	for(var i = 0; i < users.length; i++){
		var user = users[i];
		if(user['username'] == id){
			return done(null, user);
		}
	}
});

//	register local strategy for passport
passport.use(new localStrategy(
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
						done(null, user);	//	hand over user data to the done function
						//	cf.) done(err);		//	for error handling
					}
					else{
						done(null, false);
					}
				});
			}
		}

		done(null, false);		//	no matching user in the user list
	}
));

//	user data for exercise
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

//	Routers

app.get('/auth/login', function(req, res){
	var output = `
		<h1>Login<h1>
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

//	execute 'local' strategy
//	'failureFlash': instant message that notifies login failure to a user
app.post('/auth/login', passport.authenticate('local', {
		successRedirect: '/welcome',
		failureRedirect: '/auth/login',
		failureFalsh: false
	})
);

app.get('/welcome', function(req, res){
	if(req.user && req.user.nickname){
	// passport module creates 'user' object in the 'req' object after doing 'local' strategy
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
	var uname = req.body.username;
	var passwd = req.body.password;
	var nickname = req.body.nickname;

	hasher({password:passwd}, function(err, pass, salt, hash){
		var user = {
			username:uname,
			password:hash,
			salt:salt,
			nickname:nickname
		};

		users.push(user);

		req.login(user, function(err){
			req.session.save(function(){
				res.redirect('/welcome');
			});
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



