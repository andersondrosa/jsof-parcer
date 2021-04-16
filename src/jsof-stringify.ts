import typeOf from "./utils/typeOf";

const identifier = {
  key: ":type",
  path: "path",
  props: "props",
  _func: "function",
  _prop: "prop",
};

const isFunc = (x) =>
  typeOf(x) == "object" && x[identifier.key] == identifier._func;

const isVar = (x) =>
  typeOf(x) == "object" && x[identifier.key] == identifier._prop;

function getFunction(data) {
  //
  const path = data[identifier.path];
  const props = data[identifier.props];

  const _props = [];

  for (const i in props) {
    _props.push(JsofStringify(props[i]));
  }

  return `${path}(${_props.join()})`;
}

function getPath(data) {
  return data[identifier.path];
}

function JsofStringify(data) {
  //
  if (data === null) return "null";

  if (typeof data !== "object") {
    return typeof data === "string" ? JSON.stringify(data) : data;
  }

  if (isFunc(data)) {
    return getFunction(data);
  }

  if (isVar(data)) {
    return getPath(data);
  }

  if (typeOf(data) === "array") {
    const arr = [];

    for (const i in data) {
      arr.push(JsofStringify(data[i]));
    }

    return `[${arr.join(",")}]`;
  }

  const row = [];

  for (const key in data) {
    row.push(`"${key}": ${JsofStringify(data[key])}`);
  }

  return `{${row.join()}}`;
}

export default JsofStringify;
