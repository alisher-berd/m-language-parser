import {
    runTestSuitesToEqual,
    runTestSuitesToBeNull,
} from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import * as lexers from "../../../../src/lexer/lexers/lexers.js";

describe("Shall parse.", () => {
    runTestSuitesToEqual(
        "./test/lexer/lexers/keyword/testCases",
        /^test-suite-/,
        lexers.getKeywordToken,
    );
});

describe("Shall not parse.", () => {
    runTestSuitesToBeNull(
        "./test/lexer/lexers/keyword/testCases",
        /^invalid-test-suite-/,
        lexers.getKeywordToken,
    );
});
