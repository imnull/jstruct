const { clone, check } = require('./jstruct');

let aa = { z: 1 };
aa.a = aa;
let aaa = clone(aa);
aaa.z = 2;
aaa.a.z = 3;
console.log(aaa, aaa.a)
console.log(aa, aa.a);

console.log(clone(null))
console.log(clone(undefined))
console.log(clone(NaN))
console.log(clone({a:1,b:2,c:[1,2,3,{a:11,b:22,c:[111,222,{ a:1111,b:2222 }]},4]}))

let c = [0];
c.push(c);
let d = clone(c);
d[0] = -1
console.log(d, d[1])
console.log(c, c[1])

let a = { aa: 1, bb: '222', cc: [1,2,3,{aaa:1}], dd: 4 };
let b = { aa: 1, bb: 3, cc: [2,3,3,{aaa:1,bbb:2}] };
a.zz = a;
console.log(check(a, b))