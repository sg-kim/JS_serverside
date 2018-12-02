
var app = require('./externals/express.js')();

var conn = require('./externals/db.js')();

var passport = require('./externals/passport.js')(app);

app.listen(3006, function(){
	console.log('connected to 3006 ports!');
});

// Routers

var auth = require('./routes/auth')(passport);

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

