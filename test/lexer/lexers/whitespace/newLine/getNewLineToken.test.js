import {
    runTestSuitesToEqual,
    runTestSuitesToBeNull,
} from "../../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import * as lexers from "../../../../../src/lexer/lexers/lexers.js";

describe("Shall parse.", () => {
    runTestSuitesToEqual(
        "./test/lexer/lexers/whitespace/newLine/testCases",
        /^test-suite-/,
        lexers.getNewLineToken,
    );
});

describe("Shall not parse.", () => {
    runTestSuitesToBeNull(
        "./test/lexer/lexers/whitespace/newLine/testCases",
        /^invalid-test-suite-/,
        lexers.getNewLineToken,
    );
});
