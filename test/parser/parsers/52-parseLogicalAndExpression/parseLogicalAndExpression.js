import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";

import { testIsExpression } from "../51-parseIsExpression/parseIsExpression.js";

export function testLogicalAndExpression(parserFunction) {
    describe("logical-and-expression, valid inputs", () => {
        describe("logical-and-expression", () => {
            runTestSuitesToEqual(
                "./test/parser/parsers/52-parseLogicalAndExpression/testCases",
                /^test-suite-/,
                (input) => {
                    let tokens = lex(input);
                    tokens = filterTokens(tokens);
                    const output = parserFunction(tokens, 0);
                    return output;
                },
            );
        });

        testIsExpression(parserFunction);
    });
}
