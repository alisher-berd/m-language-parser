import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";

import { testLogicalAndExpression } from "../52-parseLogicalAndExpression/parseLogicalAndExpression.js";

export function testLogicalOrExpression(parserFunction) {
    describe("logical-or-expression, valid inputs", () => {
        describe("logical-or-expression", () => {
            runTestSuitesToEqual(
                "./test/parser/parsers/53-parseLogicalOrExpression/testCases",
                /^test-suite-/,
                (input) => {
                    let tokens = lex(input);
                    tokens = filterTokens(tokens);
                    const output = parserFunction(tokens, 0);
                    return output;
                },
            );
        });

        testLogicalAndExpression(parserFunction);
    });
}
