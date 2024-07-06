import { describe } from "@jest/globals";
import {
    loadTextFile,
    loadJsonFile,
    runTestCasesToEqual,
    runTestSuitesToThrowError,
} from "../../utils/testUtils.js";
import { lexAndParse } from "../../../src/parser/parser.js";

describe("Test valid inputs", () => {
    runTestCasesToEqual(
        "./test/parser/lexAndParse/testCases",
        "-input.txt",
        loadTextFile,
        loadJsonFile,
        lexAndParse,
    );
});

describe("Test invalid inputs.", () => {
    runTestSuitesToThrowError(
        "./test/parser/lexAndParse/testCases",
        /^invalid-test-suite-/,
        lexAndParse,
    );
});
