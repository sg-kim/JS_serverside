
module.exports = function(){

	var express = require('express');
	var bodyParser = require('body-parser');
	var session = require('express-session');
	var orientoStore = require('connect-oriento')(session);
	
	//	module for save session data into file
	var fileStore = require('session-file-store')(session);

	var app = express();

	app.set('view engine', 'jade');
	app.set('views', './view_files');
	app.locals.pretty = true;
	
	app.use(bodyParser.urlencoded({extended:false}));
	
	//	this app uses session method
	app.use(session({
		secret: '2sxk589x#@0sklk@!kxj24',
		resave: false,
		saveUninitialized: true,
		store: new orientoStore({
			server: 'host=localhost&port=2424&username=root&password=8087&db=alpha'
		})
	})
	);

	return app;
}
