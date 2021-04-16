const removeComments = (txt) =>
  txt
    .replace(/("([^\\"]|\\")*")|('([^\\']|\\')*')/g, (m) =>
      m.replace(/\//g, "\\/")
    )
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "")
    .replace(/\\\//g, "/");

export default removeComments;
