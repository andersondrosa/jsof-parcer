import stripJsonComments from "strip-json-comments";
import identifiers from "./identifiers";

const isAlpha = (char) => char && /^[a-zA-Z_$]+$/i.test(char);
const isAhoba = (char) => char && /^[@]+$/i.test(char);
const isAlphaNum = (char) => char && /^[a-zA-Z_$0-9]+$/i.test(char);
const isReservedKey = (key) => ["true", "false", "null"].includes(key);

class GroupOfValues {
  values: any;
  constructor(values) {
    this.values = values;
  }
  last() {
    return this.values[this.values.length - 1];
  }
}

function isGroup(x) {
  return x instanceof GroupOfValues;
}

function getGroupValues(group) {
  return group.values;
}

function args(x) {
  if (x instanceof GroupOfValues) {
    return x.values;
  }
  return [x];
}
function _value(x) {
  if (x instanceof GroupOfValues) {
    return x.values;
  }
  return x;
}

function invoker(into, args) {
  return {
    [identifiers.type]: identifiers._invoker,
    [identifiers.into]: into,
    [identifiers.args]: args,
  };
}

function JsofParse(text: String | Object) {
  //
  if (typeof text == "object") {
    text = JSON.stringify(text);
  }

  if (typeof text != "string")
    throw new Error("JSON_ERROR_0004 Unexpected token");

  let i = 0;

  let str = stripJsonComments(text);

  const value = parseValue();

  expectEndOfInput();

  if (isGroup(value)) return value.last();

  return value;

  function parseObject() {
    if (str[i] === "{") {
      i++;
      skipWhitespace();

      const result = {};

      let initial = true;
      // if it is not '}',
      // we take the path of string -> whitespace -> ':' -> value -> ...
      while (i < str.length && str[i] !== "}") {
        if (!initial) {
          eatComma();
          skipWhitespace();
        }
        let key = parseString();
        if (key === undefined) {
          key = parseKey();
          if (!key) expectObjectKey();
        }
        skipWhitespace();
        eatColon();
        const value = parseValue();
        result[key] = isGroup(value) ? value.last() : value;
        initial = false;

        if (str[i] == ",") {
          const last_i = i;
          i++;
          skipWhitespace();
          if (str[i] == "}") {
            i++;
            return result;
          }
          i = last_i;
        }
      }
      expectNotEndOfInput("}");
      // move to the next character of '}'
      i++;

      return result;
    }
  }

  function parseArray() {
    if (str[i] === "[") {
      i++;
      skipWhitespace();

      const result = [];
      let initial = true;
      let commas = 1;
      while (i < str.length) {
        //
        if (str[i] === "]") break;

        if (!initial) {
          skipWhitespace();
          eatComma();
          commas++;
        }
        initial = false;

        const value = parseValue();
        if (value !== undefined) {
          result.push(value);
          commas--;
          continue;
        }
        if (str[i] == "]") break;
        if (commas == 0) {
          commas++;
          continue;
        }
        unexpectedToken(str[i]);
      }
      expectNotEndOfInput("]");
      i++;
      return result;
    }
  }

  function parseValidValue() {
    skipWhitespace();
    const response =
      parseString() ??
      parseNumber() ??
      parseObject() ??
      parseArray() ??
      parseArguments() ??
      parseFunction();
    skipWhitespace();
    return response;
  }

  function parseValue() {
    //
    let response: any = parseValidValue();

    let sequence = parseNextArrow();

    if (sequence) {
      while (sequence) {
        let { value, next } = sequence;

        if (!value || !value._type) unexpectedToken(value);

        response = invoker(value, args(response));
        sequence = next;
      }
    }

    const nextCalls = parseNextCalls(response);

    if (nextCalls) return nextCalls;

    return response;
  }

  function parseKey() {
    let keyword = "";
    if (!isAlpha(str[i])) return;
    keyword += str[i];
    i++;

    for (let a = 0; a < 100; a++) {
      if (isAlphaNum(str[i])) {
        keyword += str[i];
        i++;
        continue;
      }
      return keyword;
    }
  }

  function parsePath() {
    const keys = [];
    let init = true;
    while (i <= str.length) {
      //
      const key = parseKey();

      if (key) {
        if (isReservedKey(key)) {
          if (!init) unexpectedReservedKey(key);
          if (str[i] == ".") unexpectedAccessIntoReservedKey(key);
        }
        keys.push(key);
        init = false;
        continue;
      }

      if (str[i] === ".") {
        if (isAlpha(str[i + 1])) {
          i++;
          continue;
        }
        unexpectedToken(".");
      }

      if (keys.length == 0) return undefined;

      return keys.join(".");
    }
  }

  function parseProps() {
    skipWhitespace();
    if (str[i] != "(") return undefined;
    i++;
    const props = [];
    while (i < str.length) {
      skipWhitespace();
      const value = parseValue();

      if (value !== undefined) props.push(value);

      if (str[i] === ",") {
        eatComma();
        continue;
      }
      if (str[i] === ")") {
        i++;
        const next = parseProps();
        return { props, next };
      }
      unexpectedToken(str[i]);
    }
  }

  function parseArgumentKeys() {
    const initial_i = i;

    skipWhitespace();
    const key = parseKey();
    if (!key) {
      if (str[i] == ")") return [];
      return;
    }

    const keys = [key];
    while (true) {
      skipWhitespace();
      if (str[i] === ",") eatComma();
      skipWhitespace();

      const key = parseKey();
      if (!key) {
        if (str[i] == ")") break;
        i = initial_i;
        return;
      }
      keys.push(key);
      skipWhitespace();
    }
    return keys;
  }

  function parseGroupValues() {
    const values = [];
    while (true) {
      skipWhitespace();

      const value = _value(parseValue());
      if (!value) {
        if (str[i] == ")") break;
        return;
      }
      values.push(value);
      skipWhitespace();
      if (str[i] === ",") eatComma();
    }
    return values;
  }

  function _prop(key) {
    return {
      [identifiers.type]: identifiers._prop,
      [identifiers.path]: key,
    };
  }

  function parseArguments() {
    if (str[i] !== "(") return;
    i++;
    skipWhitespace();
    let keys = parseArgumentKeys();

    if (keys != null) {
      if (str[i] == ")") i++;
      skipWhitespace();

      // Se encontrou "=>" combina com os argumentos "keys" e pode continuar
      if (str[i] + str[i + 1] === "=>") {
        i += 2;
        skipWhitespace();
        const value = _value(parseValue());
        return {
          [identifiers.type]: identifiers._lambda,
          [identifiers.args]: keys,
          [identifiers._return]: value,
        };
      }

      // (x, y) |> ...
      if (keys.length == 1) return _prop(keys[0]);
      return new GroupOfValues(keys.map(_prop));
    }
    // se retornou nulo é pq não é argumento de lambda (...) => ""
    // procurar por valores em um grupo comum (...)
    const values = parseGroupValues();
    if (str[i] == ")") i++;

    if (values.length == 1) {
      return values[0];
    }

    return new GroupOfValues(values);
  }

  function parseNextArrow() {
    skipWhitespace();
    if (str[i] == "|" && str[i + 1] == ">") {
      i += 2;
      skipWhitespace();

      const value: any = parseValidValue();

      const next = parseNextArrow();

      return { value, next };
    }
  }

  function parseNextCalls(fn) {
    skipWhitespace();
    if (str[i] != "(") return;
    
    const args = parseProps();
    if (args === undefined) return;

    if (!args.next) return invoker(fn, args.props);

    const getInvoker = (data, last) => {
      if (!data.next) return last;
      const intoInvoker = last ? last : invoker(fn, data.props);
      return getInvoker(
        data.next,
        invoker(
          intoInvoker, //
          data.next.props
        )
      );
    };

    return getInvoker(args, null);
  }

  function parseFunction() {
    if (str[i] == "@") {
      i++;
      return {
        [identifiers.type]: "lambda",
        [identifiers.args]: [],
        [identifiers._return]: parseFunction(),
      };
    }

    if (!isAlpha(str[i])) return undefined;
    const path = parsePath();

    if (path == "true") return true;
    if (path == "false") return false;
    if (path == "null") return null;

    const args = parseProps();

    if (args === undefined) {
      skipWhitespace();
      if (str[i] + str[i + 1] == "=>") {
        i += 2;
        const value = _value(parseValue());
        return {
          [identifiers.type]: identifiers._lambda,
          [identifiers.args]: [path],
          [identifiers._return]: value,
        };
      }
      return _prop(path);
    }

    if (!args.next) return invoker(_prop(path), args.props);

    const getInvoker = (data, last) => {
      if (!data.next) return last;
      const intoInvoker = last ? last : invoker(_prop(path), data.props);
      return getInvoker(
        data.next,
        invoker(
          intoInvoker, //
          data.next.props
        )
      );
    };

    return getInvoker(args, null);
  }

  function skipWhitespace() {
    while (
      str[i] === " " ||
      str[i] === "\n" ||
      str[i] === "\t" ||
      str[i] === "\r"
    ) {
      i++;
    }
  }

  function parseString() {
    if (str[i] === '"') {
      i++;
      let result = "";
      while (i < str.length && str[i] !== '"') {
        if (str[i] === "\\") {
          const char = str[i + 1];
          if (
            char === '"' ||
            char === "\\" ||
            char === "/" ||
            char === "b" ||
            char === "f" ||
            char === "n" ||
            char === "r" ||
            char === "t"
          ) {
            result += char;
            i++;
          } else if (char === "u") {
            if (
              isHexadecimal(str[i + 2]) &&
              isHexadecimal(str[i + 3]) &&
              isHexadecimal(str[i + 4]) &&
              isHexadecimal(str[i + 5])
            ) {
              result += String.fromCharCode(
                parseInt(str.slice(i + 2, i + 6), 16)
              );
              i += 5;
            } else {
              i += 2;
              expectEscapeUnicode(result);
            }
          } else {
            expectEscapeCharacter(result);
          }
        } else {
          result += str[i];
        }
        i++;
      }
      expectNotEndOfInput('"');
      i++;
      return result;
    }
  }

  function isHexadecimal(char) {
    return (
      (char >= "0" && char <= "9") ||
      (char.toLowerCase() >= "a" && char.toLowerCase() <= "f")
    );
  }

  function parseNumber() {
    let start = i;
    if (str[i] === "-") {
      i++;
      expectDigit(str.slice(start, i));
    }
    if (str[i] === "0") {
      i++;
    } else if (str[i] >= "1" && str[i] <= "9") {
      i++;
      while (str[i] >= "0" && str[i] <= "9") {
        i++;
      }
    }

    if (str[i] === ".") {
      i++;
      expectDigit(str.slice(start, i));
      while (str[i] >= "0" && str[i] <= "9") {
        i++;
      }
    }

    if (i > start) {
      return Number(str.slice(start, i));
    }
  }

  function eatComma() {
    expectCharacter(",");
    i++;
  }

  function eatColon() {
    expectCharacter(":");
    i++;
  }

  // error handling
  function expectNotEndOfInput(expected) {
    if (i === str.length) {
      printCodeSnippet(`Expecting a \`${expected}\` here`);
      throw new Error("JSON_ERROR_0001 Unexpected End of Input");
    }
  }

  function expectEndOfInput() {
    if (i < str.length) {
      printCodeSnippet("Expecting to end here");
      throw new Error("JSON_ERROR_0002 Expected End of Input");
    }
  }

  function expectObjectKey() {
    printCodeSnippet(`Expecting object key here

For example:
{ "foo": "bar" }
  ^^^^^`);
    throw new Error("JSON_ERROR_0003 Expecting JSON Key");
  }

  function unexpectedToken(token) {
    printCodeSnippet(`Unexpected token \`${token}\``);
    throw new Error("JSON_ERROR_0004 Unexpected token");
  }

  function unexpectedReservedKey(expected) {
    printCodeSnippet(
      `Can't access prop \`${expected}\` because it is a reserved keyword`
    );
    throw new Error("JSON_ERROR_0010 Unexpected reserved keyword");
  }

  function unexpectedAccessIntoReservedKey(expected) {
    printCodeSnippet(
      `Can't access prop inside of \`${expected}\` because it is a reserved keyword`
    );
    throw new Error("JSON_ERROR_0010 Unexpected reserved keyword");
  }

  function expectCharacter(expected) {
    if (str[i] !== expected) {
      printCodeSnippet(`Expecting a \`${expected}\` here`);
      throw new Error("JSON_ERROR_0004 Unexpected token");
    }
  }

  function expectDigit(numSoFar) {
    if (!(str[i] >= "0" && str[i] <= "9")) {
      printCodeSnippet(`JSON_ERROR_0005 Expecting a digit here

For example:
${numSoFar}5
${" ".repeat(numSoFar.length)}^`);
      throw new Error("JSON_ERROR_0006 Expecting a digit!!!!");
    }
  }

  function expectEscapeCharacter(strSoFar) {
    printCodeSnippet(`JSON_ERROR_0007 Expecting escape character

For example:
"${strSoFar}\\n"
${" ".repeat(strSoFar.length + 1)}^^
List of escape characters are: \\", \\\\, \\/, \\b, \\f, \\n, \\r, \\t, \\u`);
    throw new Error("JSON_ERROR_0008 Expecting an escape character");
  }

  function expectEscapeUnicode(strSoFar) {
    printCodeSnippet(`Expect escape unicode

For example:
"${strSoFar}\\u0123
${" ".repeat(strSoFar.length + 1)}^^^^^^`);
    throw new Error("JSON_ERROR_0009 Expecting an escape unicode");
  }

  function printCodeSnippet(message) {
    if (JsofParse.silence) return;
    const from = Math.max(0, i - 20);
    const trimmed = from > 0;
    const padding = (trimmed ? 4 : 0) + (i - from);
    const snippet = [
      (trimmed ? "... " : "") + str.slice(from, i + 1),
      " ".repeat(padding) + "^",
      " ".repeat(padding) + message,
    ].join("\n");
    // console.log(snippet);
  }
}

JsofParse.silence = true;

export default JsofParse;
