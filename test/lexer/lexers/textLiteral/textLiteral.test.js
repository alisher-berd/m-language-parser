import {
    runTestSuitesToEqual,
    runTestSuitesToBeNull,
} from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import * as lexers from "../../../../src/lexer/lexers/lexers.js";

describe("Shall parse.", () => {
    runTestSuitesToEqual(
        "./test/lexer/lexers/textLiteral/testCases",
        /^test-suite-/,
        lexers.getTextLiteralToken,
    );
});

describe("Shall not parse.", () => {
    runTestSuitesToBeNull(
        "./test/lexer/lexers/textLiteral/testCases",
        /^invalid-test-suite-/,
        lexers.getTextLiteralToken,
    );
});
