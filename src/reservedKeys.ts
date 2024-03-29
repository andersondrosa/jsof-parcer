export const reservedWords = [
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "let",
  "new",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
  "enum",
  "implements",
  "interface",
  "package",
  "private",
  "protected",
  "public",
  "static",
  "true",
  "false",
  "null",
  "NaN",
  "Infinity",
  "undefined",
  "type",
  "namespace",
  "declare",
  "module",
  "any",
  "number",
  "boolean",
  "string",
  "symbol",
  "never",
  "unknown",
  "as",
  "from",
  "global",
  "abstract",
  "readonly",
];

export function getReservedKey(key) {
  if (key.startsWith("_") && reservedWords.includes(key.substr(1)))
    return key.substr(1);
  return key;
}

export function parseReservedKey(key) {
  return reservedWords.includes(key) ? "_" + key : key;
}
