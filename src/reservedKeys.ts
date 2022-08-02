const reservedWords = [
  "toString",
  "abstract",
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
  "enum",
  "export",
  "extends",
  "finally",
  "for",
  "function",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "interface",
  "let",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
];

export function getReservedKey(key) {
  if (key.startsWith("_") && reservedWords.includes(key.substr(1)))
    return key.substr(1);
  return key;
}

export function parseReservedKey(key) {
  return reservedWords.includes(key) ? "_" + key : key;
}
