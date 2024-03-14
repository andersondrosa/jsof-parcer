export { getInitialFunctionCode } from "./getInitialFunctionCode";
export { getCode } from "./getCode";
export { getInvokerCode } from "./getInvokerCode";
export { getLambdaCode } from "./getLambdaCode";
export { getPropCode } from "./getPropCode";
export { getValueCode } from "./getValueCode";

import { getInitialFunctionCode } from "./getInitialFunctionCode";

export function build(json) {
  return new Function("return " + getInitialFunctionCode(json))();
}
