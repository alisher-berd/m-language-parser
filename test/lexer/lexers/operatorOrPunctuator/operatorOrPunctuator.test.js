import {
    runTestSuitesToEqual,
    runTestSuitesToBeNull,
} from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import * as lexers from "../../../../src/lexer/lexers/lexers.js";

describe("Shall parse.", () => {
    runTestSuitesToEqual(
        "./test/lexer/lexers/operatorOrPunctuator/testCases",
        /^test-suite-/,
        lexers.getOperatorOrPunctuatorToken,
    );
});

describe("Shall not parse.", () => {
    runTestSuitesToBeNull(
        "./test/lexer/lexers/operatorOrPunctuator/testCases",
        /^invalid-test-suite-/,
        lexers.getOperatorOrPunctuatorToken,
    );
});
