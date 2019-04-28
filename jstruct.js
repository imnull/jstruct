const O = Object.prototype.toString;
const T = v => O.call(v).slice(8, -1);
const TT = (a, b) => (a = T(a), a === T(b) ? a : '*');

const COMPARE = {
    'Array': (a, b, result, parentPath, trap) => {
        if(trap.indexOf(b) > -1){
            return -1;
        }
        trap.push(b);
        let st = 1;
        for(let i = 0, len = Math.max(a.length, b.length); i < len; i++){
            let status = _compare(a[i], b[i], result, [...parentPath, i], trap);
            if(st === 1 && status !== 1){
                st = 0;
            }
        }
        return st;
    },
    'Object': (a, b, result, parentPath, trap) => {
        if(trap.indexOf(b) > -1){
            return -1;
        }
        trap.push(b);
        let aKeys = Object.keys(a);
        let bKeys = Object.keys(b);

        // if(aKeys.length !== bKeys.length || aKeys.some(k => bKeys.indexOf(k) < 0)){
        //     return 0;
        // }

        let st = 1;
        [...aKeys, ...bKeys].filter((v, i, vv) => vv.indexOf(v) === i).forEach(i => {
            let status = _compare(a[i], b[i], result, [...parentPath, i], trap);
            if(st === 1 && status !== 1){
                st = 0;
            }
        })
        return st;
    }
};

const _compare = (a, b, result = [], path = [], trap = []) => {
    let t = TT(a, b);
    if(t === '*' || !(t in COMPARE)){
        let status = a === b ? 1 : 0;
        result.push({ left: a, right: b, path, status });
        return status;
    } else {
        return COMPARE[t](a, b, result, path, trap)
    }
}

const compare = (a, b) => {
    let r = [];
    _compare(a, b, r);
    return r;
}

let a = { aa: 1, bb: 2, cc: [1,2,3,{aaa:1}] };
let b = { aa: 1, bb: 3, cc: [2,3,3,{aaa:1,bbb:2}] };
console.log(compare(a, b))