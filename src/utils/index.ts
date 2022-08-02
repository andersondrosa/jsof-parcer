export function typeOf(v) {
  if (typeof v === "object") {
    if (!v) return null;
    if (v.constructor.name == "Object") return "object";
    if (v.constructor.name == "Function") return "function";
    if (Array.isArray(v)) return "array";
    return "unknown";
  }
  return typeof v;
}

export const json = (params) => (x) => JSON.stringify(x, null, params.tab);
