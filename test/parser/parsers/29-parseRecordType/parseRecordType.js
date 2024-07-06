import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";

export function testValidCases(parserFunction) {
    describe("record-type, valid inputs", () => {
        runTestSuitesToEqual(
            "./test/parser/parsers/29-parseRecordType/testCases",
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
