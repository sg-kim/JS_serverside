module.exports = function(){

	var express = require('express');
	var bodyParser = require('body-parser');
	var session = require('express-session');
	var mysqlStore = require('express-mysql-session')(session);
	
	var app = express();
	
	app.set('view engine', 'jade');
	app.set('views', './view_files');
	app.locals.pretty = true;
	
	app.use(bodyParser.urlencoded({extended:false}));
	
	app.use(session({
		secret: '2skj2@#sjjsoi@!jso53s',
		resave: false,
		saveUninitialized: true,
		store: new mysqlStore({
			host: 'localhost',
			port: 3306,
			user: 'root',
			password: 'heybuddy01',
			database: 'alpha'
		})
	})
	);
	
	return app;
}

