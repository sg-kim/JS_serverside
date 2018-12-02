
module.exports = function(passport){

	var bkfd2Password = require('pbkdf2-password');
	var hasher = bkfd2Password();

	var route = require('express').Router();
	
	route.get('/login', function(req, res){
		res.render('auth/login');
	});
	
	//	execute 'local' strategy
	route.post('/login', passport.authenticate('local', {
			successRedirect: '/welcome',
			failureRedirect: '/auth/login',
			failureFalsh: false
		})
	);
	
	//	execute 'facebook' strategy
	route.get('/facebook', passport.authenticate('facebook'));
	
	//	FaceBook calls this url during executing 'facebook' strategy
	route.get('/facebook/callback', passport.authenticate(
			'facebook', {
					successRedirect: '/welcome',
					failureRedirect: '/auth/login'
			})
	);
	
	route.get('/logout', function(req, res){
		req.logout();
		req.session.save(function(){
			res.redirect('/welcome');
		});
	});
	
	route.get('/register', function(req, res){
		res.render('auth/register.jade');
	});
	
	route.post('/register', function(req, res){
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
	
	return route;
}

