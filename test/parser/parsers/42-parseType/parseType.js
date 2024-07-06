import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";

import { testPrimaryType } from "../41-parsePrimaryType/parsePrimaryType.js";
import { testNotImplementedExpression } from "../01-parseNotImplementedExpression/parseNotImplementedExpression.js";
import { testSectionAccessExpression } from "../02-parseSectionAccessExpression/parseSectionAccessExpression.js";
import { testIdentifierExpression } from "../03-parseIdentifierExpression/parseIdentifierExpression.js";
import { testLiteralExpression } from "../04-parseLiteralExpression/parseLiteralExpression.js";
import { testParenthesizedExpression } from "../05-parseParenthesizedExpression/parseParenthesizedExpression.js";
import { testListExpression } from "../10-parseListExpression/parseListExpression.js";

// type:
//     primary-type
//     primary-expression

export function testValidCases(parserFunction) {
    describe("type, valid-cases", () => {
        testPrimaryType(parserFunction);

        describe("primary-expression", () => {
            testNotImplementedExpression(parserFunction);

            testSectionAccessExpression(parserFunction);

            testIdentifierExpression(parserFunction);

            testLiteralExpression(parserFunction);

            testParenthesizedExpression(parserFunction);

            testListExpression(parserFunction);

            // cannot reuse below from primary-expression tests
            // as there are ambigious cases
            // so defining separately for this parser
            describe("record-expression, field-access-expression, item-access-expression, invoke-expression, valid inputs", () => {
                runTestSuitesToEqual(
                    "./test/parser/parsers/42-parseType/testCases",
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
    });
}
