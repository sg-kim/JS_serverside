
var app = require('./externals/express.js')();

var passport = require('./externals/passport.js')(app);

app.listen(3003, function(){
	console.log('connected to 3003 port!');
});

//	Routers

var topic = require('./routes/topic.js')();

app.use('/topic', topic);

var auth = require('./routes/auth.js')(passport);

app.use('/auth', auth);

