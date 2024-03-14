import { describe, expect, it } from "vitest";
import JSOF from "../src";

describe("", () => {
  it("it should work", () => {
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

  it("it should break with double comma into object", () => {
    const str = `{ "foo": "bar",, }`;
    const t = () => JSOF.parse(str);
    expect(t).toThrow(Error);
  });

  it("it should break with double comma into array", () => {
    const str = `["foo","bar",,]`;
    const t = () => JSOF.parse(str);
    expect(t).toThrow(Error);
  });

  it("it should break when don't close brackets", () => {
    const str = `{"foo": {}`;
    const t = () => JSOF.parse(str);
    expect(t).toThrow(Error);
  });

  it("it should break when don't close brackets 2", () => {
    const str = `["foo", "bar", "baz"`;
    const t = () => JSOF.parse(str);
    expect(t).toThrow(Error);
  });

  it("it should break when invalid token '+'", () => {
    const str = `{"foo": "bar", "number": +1}`;
    const t = () => JSOF.parse(str);
    expect(t).toThrow(Error);
  });

  it("it should work when valid token '-'", () => {
    const str = `{ "number": -1}`;
    const t = () => JSOF.parse(str);
    expect(t).not.toThrow(Error);
  });

  it("it should work when valid token '-' with digit", () => {
    const str = `{ "number": -a}`;
    const t = () => JSOF.parse(str);
    expect(t).toThrow(Error);
  });

  it("it should work when valid function path", () => {
    const str = `{"fn": fn(true)}`;
    const t = () => JSOF.parse(str);
    expect(t).not.toThrow(Error);
  });

  it("it should break when invalid function path", () => {
    const str = `{"fn": 1_fn(true)}`;
    const t = () => JSOF.parse(str);
    expect(t).toThrow(Error);
  });

  it("it should break when function don't close", () => {
    const str = `{"fn": fn(true}`;
    const t = () => JSOF.parse(str);
    expect(t).toThrow(Error);
  });

  it("it should work with one function", () => {
    const str = `map()`;
    const t = () => JSOF.parse(str);
    expect(t).not.toThrow(Error);
  });

  it("it should work with one function and correctly response", () => {
    const str = `map()`;
    expect(JSOF.parse(str)).toEqual({
      _type: "caller",
      into: {
        _type: "prop",
        path: "map",
      },
      args: [],
    });
    expect(
      JSOF.stringify({
        _type: "caller",
        into: {
          _type: "prop",
          path: "map",
        },
        args: [],
      })
    ).toEqual("map()");
  });

  it("it should work with one 'prop' and correctly response", () => {
    const str = `(user) => props.foo.bar(
        () => CMD.invoke("logout", user(1, true))
      )`;
    const json = JSOF.parse(str);
    console.log(json);

    const script = JSOF.stringify(json);
    console.log(script);

    // expect(json).toEqual({
    //   _type: "prop",
    //   path: "props.foo.bar",
    // });
  });
});
