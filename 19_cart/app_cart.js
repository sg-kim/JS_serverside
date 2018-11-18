
var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();

app.use(cookieParser('98@sk161fvi28#$u'));

app.listen(3005, function(){
	console.log('connected to 3005 port!');
});

var products = {
	1:{title:'The history of web 1'},
	2:{title:'The next web'}
};	//	This part will be replaced with DB in the real application

app.get('/products', function(req, res){
	var output = '';	//	an empty string
	for(var name in products){
		//console.log(name);	//	key
		//console.log(products[name]);	//	data
		//console.log(products[name]['title']);	//	data of the key 'title'
		output = output + `
			<li>
				<a href="/cart/${name}">${products[name]['title']}</a>
			</li>`
	}
	res.send(`
		<h1>Products</h1>
		<ul>${output}</ul>
		<a href="/cart">Cart</a>`
	);
});

app.get('/cart/:id', function(req, res){
	
	var id = req.params.id;
	
	//if(req.cookies.cart){
	if(req.signedCookies.cart){
		//var cart = req.cookies.cart;
		var cart = req.signedCookies.cart;
	}
	else{
		var cart = {};
	}

	if(!cart[id]){
		cart[id] = 0;
	}
	cart[id] = parseInt(cart[id]) + 1;

	//res.cookie('cart', cart);
	res.cookie('cart', cart, {signed:true});

	res.redirect('/cart');
});

app.get('/cart', function(req, res){

	//var cart = req.cookies.cart;
	var cart = req.signedCookies.cart;
	
	if(!cart){
		res.send('Your cart is empty!');
	}
	else{
		var output = '';
		for(var key in cart){
			output = output + `<li>${products[key]['title']}: ${cart[key]}</li>`;
		}
	}
	res.send(`
		<h1>Cart</h1>
		<ul>${output}</ul>
		<a href="/products">Products list</a>
	`);
});

