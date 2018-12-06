
module.exports = function(passport){

	var bkfd2Password = require('pbkdf2-password');
	var hasher = bkfd2Password();

	var db = require('../externals/db.js')();

	var router = require('express').Router();
	
	router.get('/login', function(req, res){
		var sql = 'SELECT * FROM topic';
		db.query(sql).then(function(results){
			res.render('auth/login', {topics:results, user:req.user});
		});
	});
	
	//	execute 'local' strategy
	//	'failureFlash': instant message that notifies login failure to a user
	router.post('/login', passport.authenticate('local', {
			successRedirect: '/topic',
			failureRedirect: '/auth/login',
			failureFalsh: false
		})
	);
	
	//	execute 'facebook' strategy
	router.get('/facebook', passport.authenticate('facebook'));
	
	//app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
	
	//	FaceBook calls this url
	router.get('/facebook/callback', passport.authenticate(
			'facebook', {
					successRedirect: '/topic',
					failureRedirect: '/auth/login'
			})
	);
	
	router.get('/logout', function(req, res){
		req.logout();
		req.session.save(function(){
			res.redirect('/topic');
		});
	});
	
	router.get('/register', function(req, res){
		var sql = 'SELECT * FROM topic';
		db.query(sql).then(function(results){
			res.render('auth/register', {topics:results, user:req.user});
		});
	});
	
	router.post('/register', function(req, res){
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

			console.log(user);
			console.log(user['authId']);
	
			var sql = 'INSERT INTO user (authId, username, password, salt, nickname) VALUES(:authId, :username, :password, :salt, :nickname)'; 

			db.query(sql,{ 
				params:{
					authId:user['authId'],
					username:user['username'],
					password:user['password'],
					salt:user['salt'],
					nickname:user['nickname']
				}
			}).then(function(results){
				req.login(user, function(err){
					req.session.save(function(){
						res.redirect('/topic');
					});
				});
			}, function(error){
				console.log(error);
				res.status(500);
			});
		});
	});
	
	return router;
}

