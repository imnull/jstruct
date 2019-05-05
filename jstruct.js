const clone = require('./clone');
const compare = require('./compare');
const check = require('./check');
const path = require('./path');
const Scheme = require('./scheme');

const { O, T, TT } = require('./t');


let a = { zz: null, aa: 1, bb: '222', cc: [1,2,3,{aaa:1,ccc:3}], dd: 4, ee: { aaa: 1 }, ff: [-1, -3, -5],gg:1 };
let b = { aa: 1, bb: 3, cc: [2,3,3,{aaa:1,bbb:2}], ee: { bbb: 2 }, ff: [,2,],gg:'gg',zzz: 1 };
// a.zz = a;

// a = [1,2,3];
// b = [2,3,4]
// console.log(generate_diff(check(a, b).diff))


// console.log('path', path(a))

let scheme = new Scheme(a);

console.log(scheme.pick(b));

// path(a).filter(item => typeof(item.value) !== 'undefined').forEach(item => {
//     console.log('pick', pick(b, item))
// })


// console.log(path([1,2,null,,undefined,3]))

module.exports = {
    clone,
    compare,
    check
};
