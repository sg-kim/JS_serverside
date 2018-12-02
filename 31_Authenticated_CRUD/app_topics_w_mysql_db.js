
var app = require('./externals/express.js')();

app.listen(3004, function(){
	console.log('connected to 3004 port!');
});

var passport = require('./externals/passport.js')(app);

//	Routers

var topic = require('./routes/topic')();
var auth = require('./routes/auth')(passport);

app.use('/topic', topic);
app.use('/auth', auth);


