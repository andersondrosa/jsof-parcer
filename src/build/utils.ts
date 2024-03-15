import { identifiers } from "../identifiers";
import { parseReservedKey } from "../reservedKeys";

const types = {
  caller: true,
  lambda: true,
  function: true,
  prop: true,
  assign: true,
  let: true,
  const: true,
  return: true,
};

export function isObject(x) {
  return x && Object.prototype.toString.call(x) === "[object Object]";
}

export function isArray(val) {
  return (
    val != null &&
    val.length >= 0 &&
    Object.prototype.toString.call(val) === "[object Array]"
  );
}

export const isMetaObject = (x) => isObject(x) && types[x[identifiers.type]];

export const getMetaType = (x) => (x ? x[identifiers.type] : null);
export const getMetaArgs = (x) => (x ? x[identifiers.args] : []);

export const isCaller = (x) => x[identifiers.type] == identifiers._caller;

export const isLambda = (x) => x[identifiers.type] == identifiers._lambda;

export const isFunction = (x) => x[identifiers.type] == identifiers._function;

export const isProp = (x) => x[identifiers.type] == identifiers._prop;
export const isConst = (x) => x[identifiers.type] == identifiers._const;
export const isLet = (x) => x[identifiers.type] == identifiers._let;
export const isReturn = (x) => x[identifiers.type] == identifiers._return;

export const isSetter = (x) => x[identifiers.type] == identifiers._set;

export const getPathName = (x) => parseReservedKey(x[identifiers.path]);

export function getPath(data) {
  const keys = getPathKeys(data);
  return keys.join(".");
}

export function getPathKeys(data) {
  const path = data[identifiers.path];
  if (!path) [];
  return path.split(".").map((key) => parseReservedKey(key));
}

export function getProps(data) {
  return data[identifiers.args];
}
