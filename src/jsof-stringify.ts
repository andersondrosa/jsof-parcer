import getCode from "./build/getCode";
import identifiers from "./identifiers";
import typeOf from "./utils/typeOf";

const isInvoker = (x) =>
  typeOf(x) == "object" && x[identifiers.type] == identifiers._invoker;

const isVar = (x) =>
  typeOf(x) == "object" && x[identifiers.type] == identifiers._prop;

function getFunction(data: any) {
  //
  const path: string = data[identifiers.path];

  // if (path == "json") return data;

  const props: any = data[identifiers.args];

  const _props: any[] = [];

  for (const i in props) {
    _props.push(JsofStringify(props[i]));
  }

  return `${path}(${_props.join()})`;
}

function getPath(data) {
  return data[identifiers.path];
}

function JsofStringify(data: any) {
  //
  if (data === null) return "null";

  if (typeof data !== "object") {
    return typeof data === "string" ? JSON.stringify(data) : data;
  }

  if (isInvoker(data)) {
    return getFunction(data);
  }

  if (isVar(data)) {
    return getPath(data);
  }

  if (typeOf(data) === "array") {
    const arr: any[] = [];

    for (const i in data) {
      arr.push(JsofStringify(data[i]));
    }

    return `[${arr.join(",")}]`;
  }

  const row: any[] = [];

  for (const key in data) {
    row.push(`"${key}": ${JsofStringify(data[key])}`);
  }

  return `{${row.join()}}`;
}

function stringify(data, verbose = false) {
  const { code, deps } = getCode(data);
  return verbose ? { code, deps } : code;
}

export default stringify;
