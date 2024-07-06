import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";

export function testValidCases(parserFunction) {
    describe("primitive-type, valid inputs", () => {
        runTestSuitesToEqual(
            "./test/parser/parsers/24-parseListType/testCases",
            /^test-suite-/,
            (input) => {
                let tokens = lex(input);
                tokens = filterTokens(tokens);
                const output = parserFunction(tokens, 0);
                return output;
            },
        );
    });
}
