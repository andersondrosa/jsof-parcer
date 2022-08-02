export { default as getFunctionCode } from "./getFunctionCode";
export { default as getCode } from "./getCode";
export { default as getInvokerCode } from "./getInvokerCode";
export { default as getLambdaCode } from "./getLambdaCode";
export { default as getPropCode } from "./getPropCode";
export { default as getValueCode } from "./getValueCode";

import getFunctionCode from "./getFunctionCode";
export function build(json) {
  return new Function("return " + getFunctionCode(json))();
}
