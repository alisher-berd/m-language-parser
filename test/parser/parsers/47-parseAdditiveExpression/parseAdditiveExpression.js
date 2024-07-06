import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";

import { testMultiplicativeExpression } from "../46-parseMultiplicativeExpression/parseMultiplicativeExpression.js";

export function testAdditiveExpression(parserFunction) {
    describe("additive-expression, valid inputs", () => {
        describe("additive-expression", () => {
            runTestSuitesToEqual(
                "./test/parser/parsers/47-parseAdditiveExpression/testCases",
                /^test-suite-/,
                (input) => {
                    let tokens = lex(input);
                    tokens = filterTokens(tokens);
                    const output = parserFunction(tokens, 0);
                    return output;
                },
            );
        });

        testMultiplicativeExpression(parserFunction);
    });
}
