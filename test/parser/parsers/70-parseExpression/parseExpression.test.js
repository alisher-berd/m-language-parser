import { describe } from "@jest/globals";
import * as parsers from "../../../../src/parser/parsers/parsers.js";

import { testLogicalOrExpression } from "../53-parseLogicalOrExpression/parseLogicalOrExpression.js";
import { testFunctionExpression } from "../58-parseFunctionExpression/parseFunctionExpression.js";
import { testErrorHandlingExpression } from "../62-parseErrorHandlingExpression/parseErrorHandlingExpression.js";
import { testErrorRaisingExpression } from "../63-parseErrorRaisingExpression/parseErrorRaisingExpression.js";
import { testIfExpression } from "../64-parseIfExpression/parseIfExpression.js";
import { testEachExpression } from "../65-parseEachExpression/parseEachExpression.js";
import { testLetExpression } from "../69-parseLetExpression/parseLetExpression.js";

// expression:
//     logical-or-expression
//     function-expression
//     error-handling-expression
//     error-raising-expression
//     if-expression
//     each-expression
//     let-expression

describe("primary-expression", () => {
    testLogicalOrExpression(parsers.parseExpression);

    testFunctionExpression(parsers.parseExpression);

    testErrorHandlingExpression(parsers.parseExpression);

    testErrorRaisingExpression(parsers.parseExpression);

    testIfExpression(parsers.parseExpression);

    testEachExpression(parsers.parseExpression);

    testLetExpression(parsers.parseExpression);
});
