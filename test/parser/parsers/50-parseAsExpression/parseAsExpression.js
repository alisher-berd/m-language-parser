import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";

import { testEqualityExpression } from "../49-parseEqualityExpression/parseEqualityExpression.js";

export function testAsExpression(parserFunction) {
    describe("as-expression, valid inputs", () => {
        describe("as-expression", () => {
            runTestSuitesToEqual(
                "./test/parser/parsers/50-parseAsExpression/testCases",
                /^test-suite-/,
                (input) => {
                    let tokens = lex(input);
                    tokens = filterTokens(tokens);
                    const output = parserFunction(tokens, 0);
                    return output;
                },
            );
        });

        testEqualityExpression(parserFunction);
    });
}
