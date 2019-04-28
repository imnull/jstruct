const O = Object.prototype.toString;
const T = v => O.call(v).slice(8, -1);
const TT = (a, b) => (a = T(a), a === T(b) ? a : '*');

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

const CIRCULA = Symbol('-CIRCULA-');
const CirculaMap = class {
    constructor(){
        this.list = [];
    }
    add(source, key, target){
        this.list.push({ source, key, target })
    }
    fix(trap){
        this.list.forEach(({ source, key, target }) => {
            let tr = trap.find(([s, v]) => s === source);
            target[key] = tr[1];
        })
    }
};
const CLONE = {
    'Array': (v, trap, cir) => {
        let r = [];
        v.forEach((vv, i) => {
            r[i] = _clone(vv, trap, cir);
            if(r[i] === CIRCULA){
                cir.add(vv, i, r);
            }
        });
        return r;
    },
    'Object': (v, trap, cir) => {
        let r = {};
        Object.keys(v).forEach(i => {
            r[i] = _clone(v[i], trap, cir);
            if(r[i] === CIRCULA){
                cir.add(v[i], i, r);
            }
        })
        return r;
    }
};
const _clone = (v, trap, cir) => {
    if(trap.findIndex(o => o[0] === v) > -1){
        return CIRCULA;
    }
    let t = T(v);
    if(t in CLONE){
        let tr = [v];
        trap.push(tr);
        let r = CLONE[t](v, trap, cir);
        tr.push(r);
        return r;
    } else {
        return v;
    }
}

const clone = (v) => {
    let cir = new CirculaMap();
    let trap = [];
    let r = _clone(v, trap, cir);
    cir.fix(trap);
    trap = cir = null;
    return r;
};

const check = (schema, target) => {
    let diff = compare(schema, target);
    let r = { diff, result: diff.length < 1, type: '' };
    if(diff.length > 0){
        if(diff.length === 1 && diff[0].path.length === 0){
            r.type = 'root';
        } else {
            r.type = 'branch'
        }
    };
    return r;
};

const GENERATE = {
};

const generate = (path) => {

}

module.exports = {
    clone,
    compare,
    check
};
