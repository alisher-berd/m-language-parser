import {
    runTestSuitesToEqual,
    runTestSuitesToBeNull,
} from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import * as lexers from "../../../../src/lexer/lexers/lexers.js";

describe("Shall parse.", () => {
    runTestSuitesToEqual(
        "./test/lexer/lexers/numberLiteral/testCases",
        /^test-suite-/,
        lexers.getNumberLiteralToken,
    );
});

describe("Shall not parse.", () => {
    runTestSuitesToBeNull(
        "./test/lexer/lexers/numberLiteral/testCases",
        /^invalid-test-suite-/,
        lexers.getNumberLiteralToken,
    );
});
