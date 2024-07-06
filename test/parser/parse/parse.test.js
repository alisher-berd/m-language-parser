import { describe } from "@jest/globals";
import {
    loadTextFile,
    loadJsonFile,
    runTestCasesToEqual,
    runTestSuitesToThrowError,
} from "../../utils/testUtils.js";
import { lex } from "../../../src/lexer/lexer.js";
import { parse } from "../../../src/parser/parser.js";

describe("Test valid inputs", () => {
    runTestCasesToEqual(
        "./test/parser/parse/testCases",
        "-input.txt",
        loadTextFile,
        loadJsonFile,
        (input) => {
            const tokens = lex(input);
            const ast = parse(tokens);
            return ast;
        },
    );
});

describe("Test invalid inputs.", () => {
    runTestSuitesToThrowError(
        "./test/parser/parse/testCases",
        /^invalid-test-suite-/,
        (input) => {
            const tokens = lex(input);
            const ast = parse(tokens);
            return ast;
        },
    );
});
