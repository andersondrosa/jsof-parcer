import { identifiers } from "../identifiers";
import { getCode } from "./getCode";
import { destruct } from "./destruct";
import { FunctionNode } from "./types";
import { isMetaObject } from "./utils";

export function getFunctionCode(data: FunctionNode) {
  const args = data[identifiers.args]?.map((prop) => destruct(prop)) || [];

  const _deps = {};

  const steps: string[] = [];

  for (const i in data.steps) {
    const step = data.steps[i];

    if (!isMetaObject(step)) {
      steps.push(`(${JSON.stringify(step)})`);
      continue;
    }

    const { code, deps } = getCode(step);
    steps.push(code);

    deps.map((arg) => {
      if (!args.includes(arg)) _deps[arg] = true;
    });
  }

  return {
    code: [
      `function ${data.name || ""}(${args.join(", ")}) {`,
      steps.join("; ") + ";",
      "}",
    ].join(" "),
    deps: Object.keys(_deps),
    isLambda: true,
  };
}
