function getValueCode(value) {
  //
  return { code: JSON.stringify(value), deps: [] };
}
export default getValueCode;
