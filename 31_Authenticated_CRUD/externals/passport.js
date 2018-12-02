module.exports = function(app){

	var sha256 = require('sha256');
	var bkfd2Password = require('pbkdf2-password');
	var hasher = bkfd2Password();
	var conn = require('./db.js')();
	
	var passport = require('passport');
	var localStrategy = require('passport-local').Strategy;
	var facebookStrategy = require('passport-facebook').Strategy;

	app.use(passport.initialize());
	app.use(passport.session());
	
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
			clientID: 'FACEBOOK_APP_ID',
			clientSecret: 'FACEBOOK_APP_SECRET',
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

	return passport;
}
