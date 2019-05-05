const { T } = require('./t');
const path = require('./path');

const INVALID = Object.create(null);
const isNil = v => v === null || v === undefined;
const isInvalid = v => isNil(v) || (typeof(v) === 'number' && isNaN(v));
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
const _inject = (target, item, cursor) => {
    let { path } = item;
    if(cursor < path.length){
        let key = path[cursor];
        if(isNil(target) || target === INVALID){
            target = typeof(key) === 'string' ? {} : [];
        }
        target[key] = _inject(target[key], item, cursor + 1);
        return target;
    } else {
        return item.value;
    }
}

const CONVERT = {
    'Number': (value, defaultValue) => {
        return isNil(value) || isNaN(value = Number(value)) ? defaultValue : value;
    },
    'String': (value, defaultValue) => {
        if(isNil(value) || (typeof(value) === 'number' && isNaN(value))){
            return defaultValue;
        }
        return value.toString();
    }
};

class Scheme {
    constructor(scheme, conv = {}){
        this.scheme = path(scheme).filter(({ value }) => typeof(value) !== 'undefined');
        this.conv = { ...CONVERT, ...conv };
    }

    pick(target){
        let r;
        this.scheme.forEach(scheme => {
            let source = _pick(target, scheme, 0);
            console.log({ scheme, source })
            let { value } = source, { path } = scheme;
            // ** 取值转换 **
            // 成功取到分支值
            if(source.status === 'ok'){
                // 如果类型不一致
                if(source.type !== scheme.type){
                    //如果具备默认转换方法
                    if(scheme.type in this.conv){
                        value = this.conv[scheme.type](value, scheme.value);
                    }
                }
            }
            r = _inject(r, { path, value }, 0)
        });
        return r;
    }
}

module.exports = Scheme;