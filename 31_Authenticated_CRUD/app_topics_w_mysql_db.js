
var app = require('./externals/express.js')();

app.listen(3004, function(){
	console.log('connected to 3004 port!');
});

//	Routers

var topic = require('./routes/topic')();

app.use('/topic', topic);


