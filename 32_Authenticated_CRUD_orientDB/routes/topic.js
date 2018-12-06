
module.exports = function(){

	var route = require('express').Router();

	var db = require('../externals/db.js')();

	route.get('/add', function(req, res){
	
		var sql = 'SELECT * FROM topic';
	
		db.query(sql).then(function(results){
			res.render('topic/add', {topics:results, user:req.user});
		});
	});
	
	route.get(['', '/:id'], function(req, res){
	
		var id = req.params.id;
		//var sql = 'SELECT title FROM topic';
		var sql = 'SELECT * FROM topic';
	
		if(id){
			db.query(sql).then(function(results){
				sql = 'SELECT * FROM topic WHERE @rid=:rid';
		
				db.query(sql, {params:{rid:id}}).then(function(result){
					res.render('topic/view', {topics:results, topic:result[0], user:req.user});
				});
			});
		}
		else{
			db.query(sql).then(function(results){
				res.render('topic/view', {topics:results, user:req.user});
			});
		}
	});
	
	route.post('/add', function(req, res){
	
		var title = req.body.title;
		var desc = req.body.description;
		var author = req.body.author;
		
		var sql = 'INSERT INTO topic (title, description, author) VALUES(:title, :desc, :author)';
		
		var param = {
			params:{
				title:title,
				desc:desc,
				author:author
			}
		};
	
		db.query(sql, param).then(function(results){
			var id = results[0]['@rid'];
			id = encodeURIComponent(id);
			res.redirect('/topic/' + id);
		});
	});
	
	route.get('/:id/edit', function(req, res){
		var id = req.params.id;
		var sql = "SELECT * FROM topic";
		
		//id = encodeURIComponent(id);
		
		db.query(sql).then(function(results){
			sql = 'SELECT * FROM topic WHERE @rid=:rid';
			param = {
				params:{
					rid:id
				}
			};
			db.query(sql, param).then(function(result){
				res.render('topic/edit', {topics:results, topic:result[0], user:req.user});
			});
		});
	});
	
	route.post('/:id/edit', function(req, res){
		var id = req.params.id;
		var title = req.body.title;
		var desc = req.body.description;
		var author = req.body.author;
		
		var sql = 'UPDATE topic SET title=:title, description=:desc, author=:author WHERE @rid=:rid';
	
		var param = {
			params:{
				title:title,
				desc:desc,
				author:author,
				rid:id
			}
		};
	
		db.query(sql, param).then(function(results){
			res.redirect('/topic/' + id);
		});
	});
	
	route.get('/:id/delete', function(req, res){
		
		var id = req.params.id;
	
		var sql = 'SELECT * FROM topic';
		
		db.query(sql).then(function(results){
	
			sql = 'SELECT * FROM topic WHERE @rid=:rid';
	
			param = {
				params:{
					rid:id
				}
			};
	
			db.query(sql, param).then(function(result){
				res.render('topic/delete', {topics:results, topic:result[0], user:req.user});
			});
		});
	});
	
	route.post('/:id/delete', function(req, res){
	
		var id = req.params.id;
	
		var sql = 'DELETE FROM topic WHERE @rid=:rid';
	
		var param = {
			params:{
				rid:id
			}
		}
		
		db.query(sql, param).then(function(result){
			res.redirect('/topic/');
		});
	});

	return route;
}

