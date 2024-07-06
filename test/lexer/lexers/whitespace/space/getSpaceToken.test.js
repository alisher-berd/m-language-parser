import {
    runTestSuitesToEqual,
    runTestSuitesToBeNull,
} from "../../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import * as lexers from "../../../../../src/lexer/lexers/lexers.js";

describe("Shall parse.", () => {
    runTestSuitesToEqual(
        "./test/lexer/lexers/whitespace/space/testCases",
        /^test-suite-/,
        lexers.getSpaceToken,
    );
});

describe("Shall not parse.", () => {
    runTestSuitesToBeNull(
        "./test/lexer/lexers/whitespace/space/testCases",
        /^invalid-test-suite-/,
        lexers.getSpaceToken,
    );
});
