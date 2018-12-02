module.exports = function(){

	var route = require('express').Router();

	var conn = require('../externals/db.js')();

	route.get('/add', function(req, res){
		
		var sql = 'SELECT * FROM topic';
	
		conn.query(sql, function(err, rows, fields){
			if(err){
				console.log(err);
			}
			else{
				res.render('topic/add', {topics:rows});
			}
		});
	});
	
	route.post('/add', function(req, res){
	
		var title = req.body.title;
		var description = req.body.description;
		var author = req.body.author;
		
		var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
	
		var params = [title, description, author];
	
		conn.query(sql, params, function(err, row, field){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error');
			}
			else{
				var id = row['insertId'];
				res.redirect('/topic/' + id);
			}
		});
	});
	
	route.get(['/', '/:id'], function(req, res){
	
		var id = req.params.id;
		var sql = 'SELECT * FROM topic';
	
		if(id){
			conn.query(sql, function(err, rows, fields){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error');
				}
				else{
					sql = 'SELECT * FROM topic WHERE id=?';
					var params = [id];
	
					conn.query(sql, params, function(err, row, field){
						if(err){
							console.log(err);
							res.status(500).send('Internal Server Error');
						}
						else{
							res.render('topic/view', {topics:rows, topic:row[0]});
						}
					});
				}
			});
		}
		else{
			conn.query(sql, function(err, rows, fields){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error');
				}
				else{
					res.render('topic/view', {topics:rows});
				}
			});
		}
	});
	
	route.get('/:id/edit', function(req, res){
	
		var id = req.params.id;
		var sql = 'SELECT * FROM topic';
	
		conn.query(sql, function(err, rows, fields){
	
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error');
			}
			else{
				sql = 'SELECT * FROM topic WHERE id=?';
				var params = [id];
		
				conn.query(sql, params, function(err, row, field){
	
					if(err){
						console.log(err);
						res.status(500).send('Internal Server Error');
					}
					else{
						res.render('topic/edit', {topics:rows, topic:row[0]});
					}
				});
			}
		});
	});
	
	route.post('/:id/edit', function(req, res){
	
		var id = req.params.id;
		var title = req.body.title;
		var description = req.body.description;
		var author = req.body.author;
	
		var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
		var params = [title, description, author, id];
	
		conn.query(sql, params, function(err, row, field){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error');
			}
			else{
				res.redirect('/topic/' + id);
			}
		});
	});
	
	route.get('/:id/delete', function(req, res){
	
		var id = req.params.id;
		var sql = 'SELECT * FROM topic';
	
		conn.query(sql, function(err, rows, fields){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error');
			}
			else{
				sql = 'SELECT * FROM topic WHERE id=?';
				var params = [id];
	
				conn.query(sql, params, function(err, row, field){
					if(err){
						console.log(err);
						res.status(500).send('Internal Server Error');
					}
					else{
						if(row.length == 0){
							console.log(err);
							res.status(500).send('Internal Server Error');
						}
						else{
							res.render('topic/delete', {topics:rows, topic:row[0]});
						}
					}
				});
			}
		});
	});
	
	route.post('/:id/delete', function(req, res){
	
		var id = req.params.id;
		var sql = 'DELETE FROM topic WHERE id=?';
	
		params = [id];
			
		conn.query(sql, params, function(err, rows, fields){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error');
			}
			else{
				res.redirect('/topic');
			}
		});
	});

	return route;
}

