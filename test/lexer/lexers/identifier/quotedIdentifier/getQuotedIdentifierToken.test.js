import {
    runTestSuitesToEqual,
    runTestSuitesToBeNull,
} from "../../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import * as lexers from "../../../../../src/lexer/lexers/lexers.js";

describe("Shall parse.", () => {
    runTestSuitesToEqual(
        "./test/lexer/lexers/identifier/quotedIdentifier/testCases",
        /^test-suite-/,
        lexers.getQuotedIdentifierToken,
    );
});

describe("Shall not parse.", () => {
    runTestSuitesToBeNull(
        "./test/lexer/lexers/identifier/quotedIdentifier/testCases",
        /^invalid-test-suite-/,
        lexers.getQuotedIdentifierToken,
    );
});
