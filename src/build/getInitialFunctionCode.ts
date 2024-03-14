import getCode from "./getCode";

export function getInitialFunctionCode(data) {
  const { code, deps } = getCode(data);

  const lib = "lib";
  const tab = "  ";
  const newline = "\n";

  const dependencies = deps
    .filter((key) => key != lib)
    .map((key) => tab + `const ${key} = ${lib}.${key};`)
    .join(newline);

  return [
    `(function(${lib}) {`,
    dependencies,
    tab + `return ${code};`,
    "})", //
  ].join(newline);
}
