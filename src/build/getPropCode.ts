import { destruct } from "./destruct";
import { getCode } from "./getCode";
import { ConstNode, LetNode, PropNode, ReturnNode } from "./types";
import { getPathKeys } from "./utils";

export function getPropCode(data: PropNode) {
  const keys = getPathKeys(data);
  const key = keys[0];
  const path = keys.join(".");

  const code = `${path}`;
  return { code, deps: [key] };
}

export function getConstCode(data: ConstNode) {
  return { code: `const ${destruct(data.as)}`, deps: [] };
}

export function getLetCode(data: LetNode) {
  return { code: `let ${destruct(data.as)}`, deps: [] };
}

export function getReturnCode(data: ReturnNode) {
  const { code, deps } = getCode(data.from);
  return { code: `return ${code}`, deps };
}
