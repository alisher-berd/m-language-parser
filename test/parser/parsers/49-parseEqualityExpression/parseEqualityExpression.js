import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";

import { testRelationalExpression } from "../48-parseRelationalExpression/parseRelationalExpression.js";

export function testEqualityExpression(parserFunction) {
    describe("equality-expression, valid inputs", () => {
        describe("equality-expression", () => {
            runTestSuitesToEqual(
                "./test/parser/parsers/49-parseEqualityExpression/testCases",
                /^test-suite-/,
                (input) => {
                    let tokens = lex(input);
                    tokens = filterTokens(tokens);
                    const output = parserFunction(tokens, 0);
                    return output;
                },
            );
        });

        testRelationalExpression(parserFunction);
    });
}
