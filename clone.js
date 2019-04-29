const { T } = require('./t');

const CIRCULA = { UNIQUE: Math.random() };
const CLONE = {
    'Array': (v, trap, cir) => {
        let r = [];
        v.forEach((vv, i) => {
            r[i] = _clone(vv, trap, cir);
            if(r[i] === CIRCULA){
                cir.push([vv, i, r]);
            }
        });
        return r;
    },
    'Object': (v, trap, cir) => {
        let r = {};
        Object.keys(v).forEach(i => {
            r[i] = _clone(v[i], trap, cir);
            if(r[i] === CIRCULA){
                cir.push([v[i], i, r]);
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
    let cir = [];//new CirculaMap();
    let trap = [];
    let r = _clone(v, trap, cir);
    cir.forEach(([source, key, target]) => {
        let tr = trap.find(([s]) => s === source);
        target[key] = tr[1];
    })
    trap = cir = null;
    return r;
};

module.exports = clone;