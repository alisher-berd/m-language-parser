import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";

import { testTypeExpression } from "../43-parseTypeExpression/parseTypeExpression.js";

export function testUnaryExpression(parserFunction) {
    describe("unary-expression, valid inputs", () => {
        describe("unary-expression", () => {
            runTestSuitesToEqual(
                "./test/parser/parsers/44-parseUnaryExpression/testCases",
                /^test-suite-/,
                (input) => {
                    let tokens = lex(input);
                    tokens = filterTokens(tokens);
                    const output = parserFunction(tokens, 0);
                    return output;
                },
            );
        });

        testTypeExpression(parserFunction);
    });
}
