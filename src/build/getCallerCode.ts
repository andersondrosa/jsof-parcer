import { ReturnCodeData, getCode } from "./getCode";
import { isObject } from "./utils";
import { CallerNode } from "./types";

export function getCallerCode(data: CallerNode) {
  if (!data.into) throw Error("Invalid caller type");

  const args = data.args;

  if (data.into._type == "prop" && data.into.path == "mock") {
    return {
      code: JSON.stringify(args[0]),
      deps: [],
      isObject: isObject(args[0]),
    };
  }

  const props: ReturnCodeData[] = [];

  const target = getCode(data.into);

  const _deps = {};

  for (const i in target.deps) {
    _deps[target.deps[i]] = true;
  }

  for (const i in args) {
    const prop = args[i];
    props.push(getCode(prop));
  }

  const propsCode = props
    .map(({ code, deps }) => {
      deps.map((dep) => (_deps[dep] = true));
      return code;
    })
    .join(", ");

  const fnCode = target.isLambda ? `(${target.code})` : target.code;
  const code = `${fnCode}(${propsCode})`;

  return {
    code, //
    deps: Object.keys(_deps),
  };
}
