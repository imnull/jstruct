const O = Object.prototype.toString;
const T = v => O.call(v).slice(8, -1);
const TT = (a, b) => (a = T(a), a === T(b) ? a : '*');

module.exports = { O, T, TT };