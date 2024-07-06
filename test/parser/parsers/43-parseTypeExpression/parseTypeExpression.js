import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";

import { testPrimaryExpression } from "../22-parsePrimaryExpression/parsePrimaryExpression.js";

// type-expression:
//     primary-expression
//     type primary-type

export function testTypeExpression(parserFunction) {
    describe("type-expression, valid-cases", () => {
        testPrimaryExpression(parserFunction);

        describe("type primary-type, valid inputs", () => {
            runTestSuitesToEqual(
                "./test/parser/parsers/43-parseTypeExpression/testCases",
                /^test-suite-/,
                (input) => {
                    let tokens = lex(input);
                    tokens = filterTokens(tokens);
                    const output = parserFunction(tokens, 0);
                    return output;
                },
            );
        });
    });
}
