import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";

import { testAsExpression } from "../50-parseAsExpression/parseAsExpression.js";

export function testIsExpression(parserFunction) {
    describe("is-expression, valid inputs", () => {
        describe("is-expression", () => {
            runTestSuitesToEqual(
                "./test/parser/parsers/51-parseIsExpression/testCases",
                /^test-suite-/,
                (input) => {
                    let tokens = lex(input);
                    tokens = filterTokens(tokens);
                    const output = parserFunction(tokens, 0);
                    return output;
                },
            );
        });

        testAsExpression(parserFunction);
    });
}
