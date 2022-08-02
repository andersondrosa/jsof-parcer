import _isObject from "../utils/_isObject";
import getInvokerCode from "./getInvokerCode";
import getLambdaCode from "./getLambdaCode";
import getPropCode from "./getPropCode";
import getValueCode from "./getValueCode";
import {
  getMetaType,
  isArray,
  isInvoker,
  isLambda,
  isMetaObject,
  isProp,
} from "./utils";

function getCode(data) {
  if (typeof data != "object") return getValueCode(data);

  if (isMetaObject(data)) {
    if (isProp(data)) return getPropCode(data);
    if (isInvoker(data)) return getInvokerCode(data);
    if (isLambda(data)) return getLambdaCode(data);
    throw `Invalid MetaType: '${getMetaType(data)}'`;
  }

  const rows = [];
  const args = {};

  if (isArray(data)) {
    for (const i in data) {
      const { code, deps } = getCode(data[i]);
      rows.push(code);
      deps.map((i) => (args[i] = true));
    }
    return {
      code: `[${rows.join(", ")}]`,
      deps: Object.keys(args),
    };
  }

  for (const key in data) {
    const { code, deps } = getCode(data[key]);
    rows.push(`"${key}": ` + code);
    deps.map((key) => (args[key] = true));
  }

  const deps = Object.keys(args);
  
  return {
    code: `{${rows.join(", ")}}`,
    deps,
    isObject: true
  };
}

export default getCode;
