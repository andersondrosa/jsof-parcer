import _difference from "../utils/_difference";
import { getCode } from "./getCode";
import { identifiers } from "../identifiers";
import { parseReservedKey } from "../reservedKeys";

export function getLambdaCode(data) {
  const { code, deps, isObject } = getCode(data[identifiers._return]);

  const args =
    data[identifiers.args]?.map((key) => parseReservedKey(key)) || [];

  const argsCode = "(" + args.join(", ") + ")";

  const _deps = {};
  deps.map((arg) => {
    if (!args.includes(arg)) _deps[arg] = true;
  });

  return {
    code: `${argsCode} => ${isObject ? `(${code})` : code}`, //
    deps: Object.keys(_deps),
    isLambda: true,
  };
}
