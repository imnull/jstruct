const compare = require('./compare');

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

module.exports = check;