const types = {
  "[object String]": "String",
  "[object Number]": "Number",
  "[object Object]": "Object",
  "[object Array]": "Array",
  "[object Function]": "Function",
  "[object Boolean]": "Boolean",
};

function _typeOf(x) {
  if (x === null) return "Null";
  if (x === undefined) return "Undefined";
  const type = Object.prototype.toString.call(x);
  return types.hasOwnProperty(type) ? types[type] : "Unknown";
}

export default _typeOf;
