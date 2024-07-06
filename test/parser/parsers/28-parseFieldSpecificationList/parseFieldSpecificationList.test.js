import { runTestSuitesToEqual } from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import { lex } from "../../../../src/lexer/lexer.js";
import { filterTokens } from "../../../../src/parser/parser.js";
import * as parsers from "../../../../src/parser/parsers/parsers.js";

describe("field-specification-list, valid inputs", () => {
    runTestSuitesToEqual(
        "./test/parser/parsers/28-parseFieldSpecificationList/testCases",
        /^test-suite-/,
        (input) => {
            let tokens = lex(input);
            tokens = filterTokens(tokens);
            const output = parsers.parseFieldSpecificationList(tokens, 0);
            return output;
        },
    );
});
