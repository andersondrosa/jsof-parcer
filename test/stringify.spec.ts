import { describe, expect, it } from "vitest";
import { stringify } from "../src";

describe("Desc", () => {
  //
  it("it should render", () => {
    const object = {
      _type: "caller",
      into: {
        _type: "function",
        name: "test",
        args: ["ninja", { name: true, fields: ["foo", "bar"] }],
        steps: [
          {
            _type: "assign",
            to: { _type: "const", as: "object" },
            from: {
              _type: "caller",
              into: { _type: "prop", path: "put" },
              args: ["inputted-data"],
            },
          },
          {
            _type: "caller",
            into: { _type: "prop", path: "branch" },
            args: [
              {
                _type: "caller",
                into: { _type: "prop", path: "put" },
                args: ["inputted-data"],
              },
              {
                _type: "caller",
                into: { _type: "prop", path: "set" },
                args: ["test"],
              },
            ],
          },
        ],
      },
      args: [],
    };

    const object2 = {
      _type: "function",
      args: [],
      steps: [
        {
          _type: "assign",
          to: { _type: "const", as: { createElement: "element" } },
          from: { _type: "prop", path: "React" },
        },
        {
          _type: "assign",
          to: { _type: "const", as: ["name", "setName"] },
          from: {
            _type: "caller",
            into: { _type: "prop", path: "useState" },
            args: ["Anderson"],
          },
        },
        {
          _type: "assign",
          to: { _type: "const", as: ["oldName", "setOldName"] },
          from: {
            _type: "caller",
            into: { _type: "prop", path: "useState" },
            args: ["Ninja"],
          },
        },
        {
          _type: "caller",
          into: {
            _type: "prop",
            path: "useEffect",
          },
          args: [
            {
              _type: "function",
              steps: [
                {
                  _type: "caller",
                  into: {
                    _type: "prop",
                    path: "setName",
                  },
                  args: [{ _type: "prop", path: "oldName" }],
                },
                {
                  _type: "caller",
                  into: {
                    _type: "prop",
                    path: "setOldName",
                  },
                  args: [{ _type: "prop", path: "name" }],
                },
              ],
            },
            [],
          ],
        },
        {
          _type: "function",
          name: "handleClick",
          steps: [
            {
              _type: "caller",
              into: {
                _type: "prop",
                path: "setName",
              },
              args: [{ _type: "prop", path: "oldName" }],
            },
            {
              _type: "caller",
              into: {
                _type: "prop",
                path: "setOldName",
              },
              args: [{ _type: "prop", path: "name" }],
            },
          ],
        },
        {
          _type: "return",
          from: {
            _type: "caller",
            into: { _type: "prop", path: "element" },
            args: [
              { _type: "prop", path: "ModLayout" },
              null,
              {
                _type: "caller",
                into: { _type: "prop", path: "element" },
                args: [
                  "ul",
                  { className: "flex gap-4 p-4 bg-theme-film" },
                  [
                    {
                      _type: "caller",
                      into: { _type: "prop", path: "element" },
                      args: [
                        "li",
                        { className: "text-sm" },
                        { _type: "prop", path: "name" },
                      ],
                    },
                    {
                      _type: "caller",
                      into: { _type: "prop", path: "element" },
                      args: [
                        "li",
                        {
                          className: "text-sm p-4",
                        },
                        {
                          _type: "caller",
                          into: {
                            _type: "prop",
                            path: "element",
                          },
                          args: [
                            "button",
                            {
                              className: "btn p-4 border bg-theme-bg-2",
                              onClick: { _type: "prop", path: "handleClick" },
                            },
                            "Meu Botão",
                          ],
                        },
                      ],
                    },
                  ],
                ],
              },
            ],
          },
        },
      ],
    };

    const script = stringify({
      _type: "assign",
      to: { _type: "const", as: "CustomPage" },
      from: object2,
    });

    console.log(script);
  });

  it.skip("it should work", () => {
    //
    const object = {
      pipeFunction: {
        _type: "caller",
        into: { _type: "prop", path: "pipe" },
        args: [
          {
            _type: "caller",
            into: { _type: "prop", path: "branch" },
            args: [
              {
                _type: "caller",
                into: { _type: "prop", path: "put" },
                args: ["inputted-data"],
              },
              {
                _type: "caller",
                into: { _type: "prop", path: "set" },
                args: ["test"],
              },
            ],
          },
          {
            _type: "caller",
            into: { _type: "prop", path: "context" },
            args: [
              {
                _type: "caller",
                into: { _type: "prop", path: "branch" },
                args: [
                  {
                    _type: "caller",
                    into: { _type: "prop", path: "get" },
                    args: ["test"],
                  },
                  {
                    _type: "caller",
                    into: { _type: "prop", path: "log" },
                    args: ["test"],
                  },
                ],
              },
              {
                _type: "caller",
                into: { _type: "prop", path: "branch" },
                args: [
                  {
                    _type: "caller",
                    into: { _type: "prop", path: "get" },
                    args: [
                      "root.{x}",
                      {
                        x: {
                          _type: "caller",
                          into: { _type: "prop", path: "get" },
                          args: ["value"],
                        },
                      },
                    ],
                  },
                  {
                    _type: "caller",
                    into: { _type: "prop", path: "set" },
                    args: [
                      "_.{x}",
                      {
                        x: {
                          _type: "caller",
                          into: { _type: "prop", path: "get" },
                          args: ["path"],
                        },
                      },
                    ],
                  },
                ],
              },
              {
                _type: "caller",
                into: { _type: "prop", path: "branch" },
                args: [
                  {
                    _type: "caller",
                    into: { _type: "prop", path: "compose" },
                    args: [
                      {
                        _type: "caller",
                        into: { _type: "prop", path: "set" },
                        args: ["next"],
                      },
                      {
                        _type: "caller",
                        into: { _type: "prop", path: "pipe" },
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
                _type: "caller",
                into: { _type: "prop", path: "branch" },
                args: [
                  {
                    _type: "caller",
                    into: { _type: "prop", path: "get" },
                    args: ["next"],
                  },
                  {
                    _type: "caller",
                    into: { _type: "prop", path: "log" },
                    args: ["NEXT"],
                  },
                ],
              },
              {
                _type: "caller",
                into: { _type: "prop", path: "map" },
                args: [
                  {
                    _type: "caller",
                    into: { _type: "prop", path: "matchIn" },
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
                _type: "caller",
                into: { _type: "prop", path: "log" },
                args: ["OUTPUT"],
              },
            ],
          },
        ],
      },
    };

    const script = stringify(object);

    // console.log(script);

    expect(script).toBe(
      '{"pipeFunction": pipe(branch(put("inputted-data"), set("test")), context(branch(get("test"), log("test")), branch(get("root.{x}", {"x": get("value")}), set("_.{x}", {"x": get("path")})), branch(compose(set("next"), pipe(json, hash))), branch(get("next"), log("NEXT")), map(matchIn({"key": lower})), log("OUTPUT")))}'
    );
  });
});

const React: any = {};
const useState = (a: any): any[] => ["", () => {}];
