import JSOF from "../dist";
JSOF.silence = true;

test("it should work", () => {
  //
  const object = {
    pipeFunction: {
      ":type": "function",
      path: "pipe",
      props: [
        {
          ":type": "function",
          path: "branch",
          props: [
            {
              ":type": "function",
              path: "put",
              props: ["inputted-data"],
            },
            {
              ":type": "function",
              path: "set",
              props: ["test"],
            },
          ],
        },
        {
          ":type": "function",
          path: "context",
          props: [
            {
              ":type": "function",
              path: "branch",
              props: [
                {
                  ":type": "function",
                  path: "get",
                  props: ["test"],
                },
                {
                  ":type": "function",
                  path: "log",
                  props: ["test"],
                },
              ],
            },
            {
              ":type": "function",
              path: "branch",
              props: [
                {
                  ":type": "function",
                  path: "get",
                  props: [
                    "root.{x}",
                    {
                      x: {
                        ":type": "function",
                        path: "get",
                        props: ["value"],
                      },
                    },
                  ],
                },
                {
                  ":type": "function",
                  path: "set",
                  props: [
                    "_.{x}",
                    {
                      x: {
                        ":type": "function",
                        path: "get",
                        props: ["path"],
                      },
                    },
                  ],
                },
              ],
            },
            {
              ":type": "function",
              path: "branch",
              props: [
                {
                  ":type": "function",
                  path: "compose",
                  props: [
                    {
                      ":type": "function",
                      path: "set",
                      props: ["next"],
                    },
                    {
                      ":type": "function",
                      path: "pipe",
                      props: [
                        {
                          ":type": "prop",
                          path: "json",
                        },
                        {
                          ":type": "prop",
                          path: "hash",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              ":type": "function",
              path: "branch",
              props: [
                {
                  ":type": "function",
                  path: "get",
                  props: ["next"],
                },
                {
                  ":type": "function",
                  path: "log",
                  props: ["NEXT"],
                },
              ],
            },
            {
              ":type": "function",
              path: "map",
              props: [
                {
                  ":type": "function",
                  path: "matchIn",
                  props: [
                    {
                      key: {
                        ":type": "prop",
                        path: "lower",
                      },
                    },
                  ],
                },
              ],
            },
            {
              ":type": "function",
              path: "log",
              props: ["OUTPUT"],
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
