export function getValueCode(value) {
  return { code: JSON.stringify(value), deps: [] };
}
