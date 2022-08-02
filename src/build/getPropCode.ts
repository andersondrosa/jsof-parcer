import { getPathKeys } from "./utils";

function getPropCode(data) {
  const keys = getPathKeys(data);
  const key = keys[0];
  const path = keys.join(".");

  const code = `${path}`;
  return { code, deps: [key] };
}
export default getPropCode;
