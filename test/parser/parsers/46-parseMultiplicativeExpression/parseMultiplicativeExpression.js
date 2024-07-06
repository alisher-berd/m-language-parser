import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";

import { testMetadataExpression } from "../45-parseMetadataExpression/parseMetadataExpression.js";

export function testMultiplicativeExpression(parserFunction) {
    describe("multiplicative-expression, valid inputs", () => {
        describe("multiplicative-expression", () => {
            runTestSuitesToEqual(
                "./test/parser/parsers/46-parseMultiplicativeExpression/testCases",
                /^test-suite-/,
                (input) => {
                    let tokens = lex(input);
                    tokens = filterTokens(tokens);
                    const output = parserFunction(tokens, 0);
                    return output;
                },
            );
        });

        testMetadataExpression(parserFunction);
    });
}
