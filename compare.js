const { TT } = require('./t');

const COMPARE = {
    'Array': (a, b, result, parentPath, trap) => {
        if(trap.indexOf(b) > -1){
            return;
        }
        trap.push(b);
        let st = 1;
        for(let i = 0, len = Math.max(a.length, b.length); i < len; i++){
            _compare(a[i], b[i], result, [...parentPath, i], trap);
        }
    },
    'Object': (a, b, result, parentPath, trap) => {
        if(trap.indexOf(b) > -1){
            return;
        }
        trap.push(b);
        let aKeys = Object.keys(a);
        let bKeys = Object.keys(b);
        [...aKeys, ...bKeys].filter((v, i, vv) => vv.indexOf(v) === i).forEach(i => {
            _compare(a[i], b[i], result, [...parentPath, i], trap)
        })
    }
};

const _compare = (a, b, result = [], path = [], trap = []) => {
    let t = TT(a, b);
    if(t === '*' || !(t in COMPARE)){
        // 0: a/b相等
        // 1: a/b不等，且a缺失
        // 2: a/b不等，a存在，但b缺失
        // 3: a/b不等，且a/b存在  
        let status = a === b ? 0 : a === undefined ? 1 : b === undefined ? 2 : 3;
        if(status !== 0){
            result.push({ left: a, right: b, path, status });
        }
    } else {
        COMPARE[t](a, b, result, path, trap)
    }
}

const compare = (a, b) => {
    let r = [];
    _compare(a, b, r);
    return r;
};

module.exports = compare;