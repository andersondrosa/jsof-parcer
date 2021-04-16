import JSOF from "../dist";
JSOF.silence = true;

test("it should work", () => {
  //
  const str = `{
    // Comment label
    "label": "My functional json",
    // Comment function
    "function": myCustomFunction(props.foo, props.bar),
    "array": [1, 2, 3, [1, 2, 3, true, false, null,],],
    "nested": {
      /** 
       * Other comment
      */
      "foo": { // comment here
        "bar": baz("lorem", ipsum.dolor([1,2,3,],),),
      },
    },
  }`;

  expect(JSOF.parse(str)).toMatchSnapshot();
});

test("it should break with double comma into object", () => {
  const str = `{ "foo": "bar",, }`;
  const t = () => JSOF.parse(str);
  expect(t).toThrow(Error);
});

test("it should break with double comma into array", () => {
  const str = `["foo","bar",,]`;
  const t = () => JSOF.parse(str);
  expect(t).toThrow(Error);
});

test("it should break when don't close brackets", () => {
  const str = `{"foo": {}`;
  const t = () => JSOF.parse(str);
  expect(t).toThrow(Error);
});

test("it should break when don't close brackets 2", () => {
  const str = `["foo", "bar", "baz"`;
  const t = () => JSOF.parse(str);
  expect(t).toThrow(Error);
});

test("it should break when invalid token '+'", () => {
  const str = `{"foo": "bar", "number": +1}`;
  const t = () => JSOF.parse(str);
  expect(t).toThrow(Error);
});

test("it should work when valid token '-'", () => {
  const str = `{ "number": -1}`;
  const t = () => JSOF.parse(str);
  expect(t).not.toThrow(Error);
});

test("it should work when valid token '-' with digit", () => {
  const str = `{ "number": -a}`;
  const t = () => JSOF.parse(str);
  expect(t).toThrow(Error);
});

test("it should work when valid function path", () => {
  const str = `{"fn": fn(true)}`;
  const t = () => JSOF.parse(str);
  expect(t).not.toThrow(Error);
});

test("it should break when invalid function path", () => {
  const str = `{"fn": 1_fn(true)}`;
  const t = () => JSOF.parse(str);
  expect(t).toThrow(Error);
});

test("it should break when function don't close", () => {
  const str = `{"fn": fn(true}`;
  const t = () => JSOF.parse(str);
  expect(t).toThrow(Error);
});
