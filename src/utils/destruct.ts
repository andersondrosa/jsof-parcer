import { reservedWords } from "../reservedKeys";

function validKey(key) {
  if (reservedWords.includes(key))
    throw Error(`Invalid reserved variable: "${key}"`);
  if (!key.match("^[a-zA-Z_][0-9a-zA-Z_]*$"))
    throw Error(`Invalid variable: "${key}"`);
  console.log(">>", key);
  return key;
}

type DestructValue = object | string | DestructValue[];

export function destruct(value: DestructValue) {
  if (typeof value == "string") return validKey(value);

  if (Array.isArray(value)) {
    const res = value.map((e) => destruct(e));
    if (res.length < 2) return "[" + res.join(", ") + "]";
    return "[" + res.join(", ") + "]";
  }

  const res = Object.entries(value)
    .filter((x) => x[1])
    .map(([key, value]) => {
      if (value === true) return validKey(key);
      if (!value) return;
      return validKey(key) + ": " + destruct(value);
    });

  if (res.length == 1) return "{ " + res.join(", ") + " }";
  if (res.length == 0) return "{}";

  return "{ " + res.join(", ") + " }";
}
