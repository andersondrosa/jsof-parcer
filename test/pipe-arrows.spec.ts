import JSOF from "../dist";

const code1 = `
(x => x |> (
  (
    ((x, y) => ((x, y) |> sum)) |> ("calc" |> set),
    (x => x |> toUpper) |> ("upper" |> set),
    (m => m |> throw) |> ("Error" |> set),
    (() => (
      ("MockedFunctionJson" |> get) |> ("CreateFunctionByJson" |> get)
    )) |> ("composedFunctionToUpper" |> set),
    [ "alpha", "beta", "omega" ] |> ("data" |> set),
    (toUpper |> map) |> mock |> ("MockedFunctionJson" |> set),
    (json => json |> build) |> ("CreateFunctionByJson" |> set),
    "composedFunctionToUpper" |> get, 
    fn => (("data" |> get) |> fn) |> ("data" |> set),
    "example" |> ("upper" |> get) |> identity, 
    x => x |> toLower |> of,
    "data" |> get |> concat,
    ("TEST ERROR 1" |> ("Error" |> get), identity) |> try,
    ("acc", (acc, x) => (acc, (x |> toLower) |> of) |> concat) |> set,
    ("acc" |> get, []) |> reduce,
    (x => x |> toUpper ) |> map,
  ) 
  |> pipe
))
|> context
`;

test("must contain equal JSON", () => {
  expect(
    JSOF.parse(`
    context(x => pipe(
      set("calc") ((x, y) => sum(x, y)),
      set("upper") (x => toUpper(x)),
      set("Error") (m => throw(m)),
      set("composedFunctionToUpper") (
        () => get("CreateFunctionByJson") (get("MockedFunctionJson"))
      ),
      set("data") ([ "alpha", "beta", "omega" ]),
      set("MockedFunctionJson") (mock(map(toUpper))),
      set("CreateFunctionByJson") (json => build(json)),
      get("composedFunctionToUpper"), 
      fn => set("data")(fn(get("data"))),
      identity(get("upper")("example")), 
      x => of(toLower(x)),
      concat(get("data")),
      try (get("Error") ("TEST ERROR 1"), identity),
      set("acc", (acc, x) => concat(acc, of(toLower(x)))),
      reduce(get("acc"), []),
      map(x => toUpper(x)),
    )(x))
  `)
  ).toEqual(JSOF.parse(code1));
});

test("to match snapshot", () => {
  expect(JSOF.parse(code1)).toMatchSnapshot();
});
