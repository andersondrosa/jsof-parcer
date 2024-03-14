import { describe, expect, it } from "vitest";
import JSOF from "../src";

describe("", () => {
  it("it should work", () => {
    //
    const object = {
      pipeFunction: {
        _type: "invoker",
        into: { _type: "prop", path: "pipe" },
        args: [
          {
            _type: "invoker",
            into: "branch",
            args: [
              {
                _type: "invoker",
                into: "put",
                args: ["inputted-data"],
              },
              {
                _type: "invoker",
                into: "set",
                args: ["test"],
              },
            ],
          },
          {
            _type: "invoker",
            into: "context",
            args: [
              {
                _type: "invoker",
                into: "branch",
                args: [
                  {
                    _type: "invoker",
                    into: "get",
                    args: ["test"],
                  },
                  {
                    _type: "invoker",
                    into: "log",
                    args: ["test"],
                  },
                ],
              },
              {
                _type: "invoker",
                into: "branch",
                args: [
                  {
                    _type: "invoker",
                    into: "get",
                    args: [
                      "root.{x}",
                      {
                        x: {
                          _type: "invoker",
                          into: "get",
                          args: ["value"],
                        },
                      },
                    ],
                  },
                  {
                    _type: "invoker",
                    into: "set",
                    args: [
                      "_.{x}",
                      {
                        x: {
                          _type: "invoker",
                          into: "get",
                          args: ["path"],
                        },
                      },
                    ],
                  },
                ],
              },
              {
                _type: "invoker",
                into: "branch",
                args: [
                  {
                    _type: "invoker",
                    into: "compose",
                    args: [
                      {
                        _type: "invoker",
                        into: "set",
                        args: ["next"],
                      },
                      {
                        _type: "invoker",
                        into: "pipe",
                        args: [
                          {
                            _type: "prop",
                            path: "json",
                          },
                          {
                            _type: "prop",
                            path: "hash",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                _type: "invoker",
                into: "branch",
                args: [
                  {
                    _type: "invoker",
                    into: "get",
                    args: ["next"],
                  },
                  {
                    _type: "invoker",
                    into: "log",
                    args: ["NEXT"],
                  },
                ],
              },
              {
                _type: "invoker",
                into: "map",
                args: [
                  {
                    _type: "invoker",
                    into: "matchIn",
                    args: [
                      {
                        key: {
                          _type: "prop",
                          path: "lower",
                        },
                      },
                    ],
                  },
                ],
              },
              {
                _type: "invoker",
                into: "log",
                args: ["OUTPUT"],
              },
            ],
          },
        ],
      },
    };

    const json = JSOF.stringify(object);

    console.log(json);

    expect(json).toBe(
      '{"pipeFunction": pipe(branch(put("inputted-data"),set("test")),' +
        'context(branch(get("test"),log("test")),branch(get("root.{x}",' +
        '{"x": get("value")}),set("_.{x}",{"x": get("path")})),' +
        'branch(compose(set("next"),pipe(json,hash))),branch(get("next"),' +
        'log("NEXT")),map(matchIn({"key": lower})),log("OUTPUT")))}'
    );
  });
});
