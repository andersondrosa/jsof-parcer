const jsTokens = require("js-tokens");

function setToken() {}

function JsofParser(jsof) {
  jsof = `{
  "my
ok": (x) => func("arg1", [ 2 ], true)
}`.replace(/(\r\n|\n|\r)/gm, "[_NEW_LNE_]");

  const tokens = Array.from(jsTokens(jsof), (token: any) => token).filter(
    (x) => x.type != "WhiteSpace" //&& x.type != "LineTerminatorSequence"
  );

  console.log(tokens);

  // function parseValue() {
  //   skipWhitespace();
  //   const value =
  //     parseString() ??
  //     parseNumber() ??
  //     parseObject() ??
  //     parseArray() ??
  //     parseFunction();
  //   skipWhitespace();
  //   return value;
  // }

  return "tokens";
}

export default JsofParser;
