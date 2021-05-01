import JSOF from "../dist";

test("it should work", () => {
  //
  const object = {
    pipeFunction: {
      "_type": "invoker",
      path: "pipe",
      args: [
        {
          "_type": "invoker",
          path: "branch",
          args: [
            {
              "_type": "invoker",
              path: "put",
              args: ["inputted-data"],
            },
            {
              "_type": "invoker",
              path: "set",
              args: ["test"],
            },
          ],
        },
        {
          "_type": "invoker",
          path: "context",
          args: [
            {
              "_type": "invoker",
              path: "branch",
              args: [
                {
                  "_type": "invoker",
                  path: "get",
                  args: ["test"],
                },
                {
                  "_type": "invoker",
                  path: "log",
                  args: ["test"],
                },
              ],
            },
            {
              "_type": "invoker",
              path: "branch",
              args: [
                {
                  "_type": "invoker",
                  path: "get",
                  args: [
                    "root.{x}",
                    {
                      x: {
                        "_type": "invoker",
                        path: "get",
                        args: ["value"],
                      },
                    },
                  ],
                },
                {
                  "_type": "invoker",
                  path: "set",
                  args: [
                    "_.{x}",
                    {
                      x: {
                        "_type": "invoker",
                        path: "get",
                        args: ["path"],
                      },
                    },
                  ],
                },
              ],
            },
            {
              "_type": "invoker",
              path: "branch",
              args: [
                {
                  "_type": "invoker",
                  path: "compose",
                  args: [
                    {
                      "_type": "invoker",
                      path: "set",
                      args: ["next"],
                    },
                    {
                      "_type": "invoker",
                      path: "pipe",
                      args: [
                        {
                          "_type": "prop",
                          path: "json",
                        },
                        {
                          "_type": "prop",
                          path: "hash",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              "_type": "invoker",
              path: "branch",
              args: [
                {
                  "_type": "invoker",
                  path: "get",
                  args: ["next"],
                },
                {
                  "_type": "invoker",
                  path: "log",
                  args: ["NEXT"],
                },
              ],
            },
            {
              "_type": "invoker",
              path: "map",
              args: [
                {
                  "_type": "invoker",
                  path: "matchIn",
                  args: [
                    {
                      key: {
                        "_type": "prop",
                        path: "lower",
                      },
                    },
                  ],
                },
              ],
            },
            {
              "_type": "invoker",
              path: "log",
              args: ["OUTPUT"],
            },
          ],
        },
      ],
    },
  };

  expect(JSOF.stringify(object)).toBe(
    '{"pipeFunction": pipe(branch(put("inputted-data"),set("test")),' +
      'context(branch(get("test"),log("test")),branch(get("root.{x}",' +
      '{"x": get("value")}),set("_.{x}",{"x": get("path")})),' +
      'branch(compose(set("next"),pipe(json,hash))),branch(get("next"),' +
      'log("NEXT")),map(matchIn({"key": lower})),log("OUTPUT")))}'
  );
});
