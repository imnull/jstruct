const clone = require('./clone');
const compare = require('./compare');
const check = require('./check');
const path = require('./path');

const { O, T, TT } = require('./t');

const GENERATE = {
};

const generate_empty = key => typeof(key) === 'string' ? {} : [];

const generate_item = (item, root) => {
    let { left, right, status, path } = item;
    if(path.length < 1) {
        return;
    }
    let p = path.slice(0);
    let key = p.shift(), k = key;
    if(!root){
        root = generate_empty(key);
    }
    let tar = root;
    while(p.length > 0){
        k = p.shift();
        if(!tar.hasOwnProperty(key)){
            tar[key] = generate_empty(k);
        }
        tar = tar[key];
        key = k;
    }
    let val;
    switch(status){
        case 1:
        case 3:
            val = right;
            break;
        default:
            val = left;
            break;
    }
    tar[key] = val;
    return root;
}

const generate_diff = (diff) => {
    console.log(diff)
    return diff.reduce((a, b) => generate_item(b, a), false);
}

let keyS = Symbol('-test-');

let a = { zz: undefined, aa: 1, bb: '222', cc: [1,2,3,{aaa:1}], dd: 4 };
let b = { aa: 1, bb: 3, cc: [2,3,3,{aaa:1,bbb:2}] };
// a.zz = a;
// a[keyS] = b;

// a = [1,2,3];
// b = [2,3,4]
// console.log(generate_diff(check(a, b).diff))

const INVALID = Object.create(null);
const isNil = v => v === null || v === undefined;
const _pick = (target, item, cursor) => {
    if(isNil(target)){
        return { status: 'nil', value: item.value };
    } else if(target === INVALID){
        return { status: 'invalid', value: item.value };
    }
    let { path } = item;
    if(cursor < path.length){
        let key = path[cursor];
        let value = target.hasOwnProperty(key) ? target[key] : INVALID;
        return _pick(value, item, cursor + 1);
    } else {
        return { status: 'ok', value: target, type: T(target) };
    }
}
const pick = (target, item) => _pick(target, item, 0);

class Scheme {
    constructor(scheme){
        this.scheme = path(scheme).filter(({ value }) => typeof(value) !== 'undefined');
    }

    pick(target){
        let map = this.scheme.map(scheme => {
            return {
                scheme,
                source: pick(target, scheme)
            }
        });
        console.log(map)
    }
}

console.log('path', path(a))

let scheme = new Scheme(a);

scheme.pick(b);

// path(a).filter(item => typeof(item.value) !== 'undefined').forEach(item => {
//     console.log('pick', pick(b, item))
// })


// console.log(path([1,2,null,,undefined,3]))

module.exports = {
    clone,
    compare,
    check
};
