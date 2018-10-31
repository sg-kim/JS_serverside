var a = [3, 1, 2];

//function b(v1, v2)
//{
//	return (v1 - v2);
//}
//
//a.sort(b);

a.sort(function b(v1, v2){console.log('c', v1, v2); return (v2 - v1);});

console.log(a);


