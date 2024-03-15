import { getCode, getVarCode } from "./getCode";
import { getPropCode } from "./getPropCode";
import { PropNode, SetterNode } from "./types";
import { getPathKeys } from "./utils";

export function getSetterCode(data: SetterNode) {
  //
  const _deps = {};

  const { code: toCode, deps: toDeps } = getVarCode(data.to as PropNode);

  const { code: fromCode, deps: fromDeps } = getCode(data.from);

  const code = `${toCode} = ${fromCode}`;

  toDeps.map((key) => (_deps[key] = true));
  fromDeps.map((key) => (_deps[key] = true));
  const deps = Object.keys(_deps);

  console.log(deps);

  return { code, deps };
}
