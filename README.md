# Power Query (M formula language) parser

## About

_m-language-parser_ is a JavaScript module for tokenizing and parsing Power Query (M formula language) scripts.

## Installation

Using npm:

    $ npm install m-language-parser

## Usage

### Lexical Analysis

Use `lex` function to get a list of tokens.

```javascript
import { lex } from "m-language-parser";

const input = "let a = 1, b = a + 1 in b";
const tokens = lex(input);

console.log(tokens);
```

The result will look like:

```json
[
  {
    "tokenType": "keyword",
    "token": "let",
    "value": "let",
    "start": 0,
    "end": 3
  },
  {
    "tokenType": "whitespace",
    "token": "whitespace",
    "value": " ",
    "start": 3,
    "end": 4
  },

]
```

### Parsing

Use `parse`, `lexAndParse` functions to get an abstract syntax tree (AST).

```javascript
import { lex, parse, lexAndParse } from "m-language-parser";

const input = "let a = 1, b = a + 1 in b";
const tokens = lex(input);
const ast = parse(tokens);

// or lexAndParse
// const ast = lexAndParse(input);

console.log(ast);
```

The result will look like:

```json
{
  "type": "let-expression",
  "id": "let-expression-0",
  "startIndex": 0,
  "stopIndex": 12,
  "variableList": [
    {
      "variableName": "a",
      "expression": {
        "type": "literal-expression",
        "id": "literal-expression-3",
        "startIndex": 3,
        "stopIndex": 4,
        "literalValue": "1",
        "literalType": "number-literal"
      }
    },
  
}

```

## License

This project is licensed under the ISC License.
