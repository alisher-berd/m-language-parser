import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";

import { testAdditiveExpression } from "../47-parseAdditiveExpression/parseAdditiveExpression.js";

export function testRelationalExpression(parserFunction) {
    describe("relational-expression, valid inputs", () => {
        describe("relational-expression", () => {
            runTestSuitesToEqual(
                "./test/parser/parsers/48-parseRelationalExpression/testCases",
                /^test-suite-/,
                (input) => {
                    let tokens = lex(input);
                    tokens = filterTokens(tokens);
                    const output = parserFunction(tokens, 0);
                    return output;
                },
            );
        });

        testAdditiveExpression(parserFunction);
    });
}
