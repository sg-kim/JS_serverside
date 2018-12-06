
var app = require('./externals/express.js')();

var passport = require('./externals/passport.js')(app);

app.listen(3006, function(){
	console.log('connected to 3006 ports!');
});

//	Routers

var auth = require('./routes/auth.js')(passport);
app.use('/auth', auth);

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



