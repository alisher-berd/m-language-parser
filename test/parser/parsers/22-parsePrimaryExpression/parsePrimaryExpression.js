import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";

import { testNotImplementedExpression } from "../01-parseNotImplementedExpression/parseNotImplementedExpression.js";
import { testSectionAccessExpression } from "../02-parseSectionAccessExpression/parseSectionAccessExpression.js";
import { testIdentifierExpression } from "../03-parseIdentifierExpression/parseIdentifierExpression.js";
import { testLiteralExpression } from "../04-parseLiteralExpression/parseLiteralExpression.js";
import { testParenthesizedExpression } from "../05-parseParenthesizedExpression/parseParenthesizedExpression.js";
import { testListExpression } from "../10-parseListExpression/parseListExpression.js";
import { testRecordExpression } from "../14-parseRecordExpression/parseRecordExpression.js";

// primary-expression:
//       not-implemented-expression
//       section-access-expression
//       identifier-expression
//       literal-expression
//       parenthesized-expression
//       list-expression
//       record-expression
//       field-access-expression
//       item-access-expression
//       invoke-expressionc

export function testPrimaryExpression(parserFunction) {
    describe("primary-expression", () => {
        testNotImplementedExpression(parserFunction);

        testSectionAccessExpression(parserFunction);

        testIdentifierExpression(parserFunction);

        testLiteralExpression(parserFunction);

        testParenthesizedExpression(parserFunction);

        testListExpression(parserFunction);

        testRecordExpression(parserFunction);

        describe("field-access-expression, item-access-expression, invoke-expression, valid inputs", () => {
            runTestSuitesToEqual(
                "./test/parser/parsers/22-parsePrimaryExpression/testCases",
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
