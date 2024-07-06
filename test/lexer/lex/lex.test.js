import { describe } from "@jest/globals";
import {
    loadTextFile,
    loadJsonFile,
    runTestCasesToEqual,
    runTestSuitesToThrowError,
} from "../../utils/testUtils.js";
import { lex } from "../../../src/lexer/lexer.js";

describe("Test valid inputs", () => {
    runTestCasesToEqual(
        "./test/lexer/lex/testCases",
        "-input.txt",
        loadTextFile,
        loadJsonFile,
        lex,
    );
});

describe("Test invalid inputs.", () => {
    runTestSuitesToThrowError(
        "./test/lexer/lex/testCases",
        /^invalid-test-suite-/,
        lex,
    );
});
