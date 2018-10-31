var fs = require('fs');


//	Synchronous method
console.log(1);
var data = fs.readFileSync('7_data.txt', {encoding:'utf8'});
console.log(data);

//	Async method
//	readFile calls callback function when the file read is done.
console.log(2);
fs.readFile('7_data.txt', {encoding:'utf8'}, function(err, data){console.log(3); console.log(data);});
console.log(4);

