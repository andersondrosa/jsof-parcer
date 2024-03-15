import _isObject from "../utils/_isObject";
import { getCallerCode } from "./getCallerCode";
import { getFunctionCode } from "./getFunctionCode";
import { getLambdaCode } from "./getLambdaCode";
import {
  getConstCode,
  getLetCode,
  getPropCode,
  getReturnCode,
} from "./getPropCode";
import { getSetterCode } from "./getSetterCode";
import { getValueCode } from "./getValueCode";
import {
  CallerNode,
  ConstNode,
  FunctionNode,
  GenericNode,
  LambdaNode,
  LetNode,
  PropNode,
  ReturnNode,
  SettableNode,
  SetterNode,
} from "./types";
import {
  getMetaType,
  isArray,
  isCaller,
  isConst,
  isFunction,
  isLambda,
  isLet,
  isMetaObject,
  isProp,
  isReturn,
  isSetter,
} from "./utils";

export type ReturnCodeData = {
  code: string;
  deps: string[];
  isObject?: boolean;
  isLambda?: boolean;
};

export function getCode(data: GenericNode): ReturnCodeData {
  if (!data || typeof data != "object") return getValueCode(data);

  if (isMetaObject(data)) {
    if (isProp(data)) return getPropCode(data as PropNode);
    if (isSetter(data)) return getSetterCode(data as SetterNode);
    if (isCaller(data)) return getCallerCode(data as CallerNode);
    if (isFunction(data)) return getFunctionCode(data as FunctionNode);
    if (isLambda(data)) return getLambdaCode(data as LambdaNode);
    if (isReturn(data)) return getReturnCode(data as ReturnNode);
    throw new Error(`Invalid MetaType: '${getMetaType(data)}'`);
  }

  const rows: string[] = [];
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
    rows.push(`"${key}": ${code}`);
    deps.map((key) => (args[key] = true));
  }

  const deps = Object.keys(args);

  return {
    code: `{${rows.join(", ")}}`,
    deps,
    isObject: true,
  };
}

export function getVarCode(data: SettableNode) {
  if (isProp(data)) return getPropCode(data as PropNode);
  if (isConst(data)) return getConstCode(data as ConstNode);
  if (isLet(data)) return getLetCode(data as LetNode);
  throw new Error(`Invalid SettableType: '${getMetaType(data)}'`);
}
