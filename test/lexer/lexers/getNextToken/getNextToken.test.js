import {
    runTestSuitesToEqual,
    runTestSuitesToBeNull,
} from "../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import * as lexers from "../../../../src/lexer/lexers/lexers.js";

describe("operator-or-punctuator", () => {
    runTestSuitesToEqual(
        "./test/lexer/lexers/operatorOrPunctuator/testCases",
        /^test-suite-/,
        lexers.getNextToken,
    );
});

describe("keyword", () => {
    runTestSuitesToEqual(
        "./test/lexer/lexers/keyword/testCases",
        /^test-suite-/,
        lexers.getNextToken,
    );
});

describe("comment", () => {
    describe("single-line-comment", () => {
        runTestSuitesToEqual(
            "./test/lexer/lexers/comment/singleLineComment/testCases",
            /^test-suite-/,
            lexers.getNextToken,
        );
    });

    describe("delimeted-comment", () => {
        runTestSuitesToEqual(
            "./test/lexer/lexers/comment/delimetedComment/testCases",
            /^test-suite-/,
            lexers.getNextToken,
        );
    });
});

describe("whitespace", () => {
    describe("whitespace", () => {
        runTestSuitesToEqual(
            "./test/lexer/lexers/whitespace/space/testCases",
            /^test-suite-/,
            lexers.getNextToken,
        );
    });

    describe("new-line-character", () => {
        runTestSuitesToEqual(
            "./test/lexer/lexers/whitespace/newLine/testCases",
            /^test-suite-/,
            lexers.getNextToken,
        );
    });
});

describe("text-literal", () => {
    runTestSuitesToEqual(
        "./test/lexer/lexers/textLiteral/testCases",
        /^test-suite-/,
        lexers.getNextToken,
    );
});

describe("number-literal", () => {
    runTestSuitesToEqual(
        "./test/lexer/lexers/numberLiteral/testCases",
        /^test-suite-/,
        lexers.getNextToken,
    );
});

describe("identifier", () => {
    describe("regular-identifier", () => {
        runTestSuitesToEqual(
            "./test/lexer/lexers/identifier/regularIdentifier/testCases",
            /^test-suite-/,
            lexers.getNextToken,
        );
    });

    describe("quoted-identifier", () => {
        runTestSuitesToEqual(
            "./test/lexer/lexers/identifier/quotedIdentifier/testCases",
            /^test-suite-/,
            lexers.getNextToken,
        );
    });
});

describe("Test on invalid inputs", () => {
    runTestSuitesToBeNull(
        "./test/lexer/lexers/getNextToken/testCases",
        /^invalid-test-suite-/,
        lexers.getNextToken,
    );
});
