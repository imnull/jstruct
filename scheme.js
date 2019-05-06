const { T, isNil, isInvalid } = require('./t');
const path = require('./path');

const INVALID = Object.create(null);

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
        if(isInvalid(value)){
            return defaultValue;
        }
        return value.toString();
    }
};

class Scheme {
    constructor(scheme, conv = {}){
        this.initScheme(scheme);
        this.initConv(conv);
    }

    initScheme(scheme){
        this.scheme = path(scheme).filter(({ value }) => typeof(value) !== 'undefined');
    }
    initConv(conv){
        this.conv = { ...CONVERT, ...conv };
    }

    pick(target){
        let r, { conv } = this;
        this.scheme.forEach(scheme => {
            let source = _pick(target, scheme, 0);
            // console.log({ scheme, source })
            let { value } = source, { path, type } = scheme;
            // ** 取值转换 **
            // 成功取到分支值
            if(source.status === 'ok'){
                // 如果类型不一致
                if(source.type !== type){
                    //如果具备默认转换方法
                    if(type in conv){
                        value = conv[type](value, scheme.value, scheme.path);
                    }
                }
            }
            r = _inject(r, { path, value }, 0)
        });
        return r;
    }
}

module.exports = Scheme;