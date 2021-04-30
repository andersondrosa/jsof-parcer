import identifiers from "./identifiers";
import typeOf from "./utils/typeOf";

const isFunc = (x) =>
  typeOf(x) == "object" && x[identifiers.type] == identifiers._invoker;

const isVar = (x) =>
  typeOf(x) == "object" && x[identifiers.type] == identifiers._prop;

function getFunction(data) {
  //
  const path = data[identifiers.path];

  // if (path == "json") return data;

  const props = data[identifiers.args];

  const _props = [];

  for (const i in props) {
    _props.push(JsofStringify(props[i]));
  }

  return `${path}(${_props.join()})`;
}

function getPath(data) {
  return data[identifiers.path];
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
