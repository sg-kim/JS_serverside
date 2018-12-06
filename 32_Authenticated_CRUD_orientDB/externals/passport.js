module.exports = function(app){

	//	modules for password security, sha256 algorithm and pbkdf2 method
	var sha256 = require('sha256');
	var bkfd2Password = require('pbkdf2-password');
	var hasher = bkfd2Password();
	
	//	passport module, strategy and hash function for integrated login control
	var passport = require('passport');
	var localStrategy = require('passport-local').Strategy;
	var facebookStrategy = require('passport-facebook').Strategy;

	var db = require('./db.js')();

	passport.serializeUser(function(user, done){
		console.log('serializeUser', user);
		//done(null, user['username']);		//	store user name into a session
		done(null, user['authId']);		//	store user name into a session
	});
	
	//	this function is called whenever user visits new pages
	passport.deserializeUser(function(id, done){
		console.log('deserializeUser', id);
		var sql = 'SELECT nickname FROM user WHERE authId=:authId';
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

	//	initialize passport
	app.use(passport.initialize());
	//	this app uses session function in the passport integrated login control
	app.use(passport.session());

	return passport;
}

