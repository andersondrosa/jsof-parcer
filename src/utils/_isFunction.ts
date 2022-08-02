function _isFunction(x) {
  var type = Object.prototype.toString.call(x);
  return type === "[object Function]" || type === "[object AsyncFunction]";
}

export default _isFunction;
