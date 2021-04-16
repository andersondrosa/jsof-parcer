# JSOF Parser

Snippet to easily parse JSON + FUNCTIONS into simple JSON ✌️💜.

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to install JSOF.

```bash
npm i jsof-parser
```

## Usage

We can start by converting a functional JSON to standard JSON

```js
import JSOF from "jsof-parser";

const code = `{
  "label": "My functional json 😍",
  "animals": concat(
    getAnimal(types.unicorn, "🦄"),
    getAnimal(types.dog, "🐕"),
  ),
}`;

const myObject = JSOF.parse(code);

const jsonData = JSON.stringify(myObject);
```

That will be printed as follow:

```json
{
  "label": "My functional json 😍",
  "animals": {
    ":type": "function",
    "path": "concat",
    "props": [
      {
        ":type": "function",
        "path": "getAnimal",
        "props": [
          {
            ":type": "prop",
            "path": "types.unicorn"
          },
          "🦄"
        ]
      },
      {
        ":type": "function",
        "path": "getAnimal",
        "props": [
          {
            ":type": "prop",
            "path": "types.dog"
          },
          "🐕"
        ]
      }
    ]
  }
}
```

## Make the reverse process

Create a JSON data as fallow

```js
const data = {
  ":type": "function",
  path: "pipe",
  props: [
    {
      map: {
        user: [
          {
            ":type": "function",
            path: "get",
            props: ["user"],
          },
          {
            ":type": "function",
            path: "pick",
            props: ["name", "nick", "email"],
          },
        ],
      },
      test: [
        {
          "user.nick": {
            ":type": "function",
            path: "match",
            props: [
              {
                ":type": "prop",
                path: "is.req",
              },
              {
                ":type": "prop",
                path: "is.slug",
              },
            ],
          },
          "user.email": {
            ":type": "function",
            path: "match",
            props: [
              {
                ":type": "prop",
                path: "is.email",
              },
            ],
          },
        },
        {
          ":type": "function",
          path: "get",
          props: ["test"],
        },
      ],
    },
  ],
};

const functionBody = JSOF.stringify(data);

const dependencies = ["pipe", "get", "pick", "match", "is"];

const params = `{ ${dependencies.join(", ")} }`;

const myFunction = eval(`(${params}) => ${functionBody}`);

console.log(myFunction.toString());
```

And the result will be one anonymous function like this

```js
({ pipe, get, pick, match, is }) =>
  pipe({
    map: { user: [get("user"), pick("name", "nick", "email")] },
    test: [
      { "user.nick": match(is.req, is.slug), "user.email": match(is.email) },
      get("test"),
    ],
  });
```

## Contribuindo com o projeto

Solicitações pull são bem-vindas. Para mudanças importantes, abra um problema primeiro para discutir o que você gostaria de mudar.

## License

[MIT](https://choosealicense.com/licenses/mit/)
