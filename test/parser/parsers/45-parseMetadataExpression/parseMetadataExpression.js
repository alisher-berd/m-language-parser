import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";

import { testUnaryExpression } from "../44-parseUnaryExpression/parseUnaryExpression.js";

export function testMetadataExpression(parserFunction) {
    describe("metadata-expression, valid inputs", () => {
        describe("metadata-expression", () => {
            runTestSuitesToEqual(
                "./test/parser/parsers/45-parseMetadataExpression/testCases",
                /^test-suite-/,
                (input) => {
                    let tokens = lex(input);
                    tokens = filterTokens(tokens);
                    const output = parserFunction(tokens, 0);
                    return output;
                },
            );
        });

        testUnaryExpression(parserFunction);
    });
}
