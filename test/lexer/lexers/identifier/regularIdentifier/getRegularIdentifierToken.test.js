import {
    runTestSuitesToEqual,
    runTestSuitesToBeNull,
} from "../../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import * as lexers from "../../../../../src/lexer/lexers/lexers.js";

describe("Shall parse.", () => {
    runTestSuitesToEqual(
        "./test/lexer/lexers/identifier/regularIdentifier/testCases",
        /^test-suite-/,
        lexers.getRegularIdentifierToken,
    );
});

describe("Shall not parse.", () => {
    runTestSuitesToBeNull(
        "./test/lexer/lexers/identifier/regularIdentifier/testCases",
        /^invalid-test-suite-/,
        lexers.getRegularIdentifierToken,
    );
});
