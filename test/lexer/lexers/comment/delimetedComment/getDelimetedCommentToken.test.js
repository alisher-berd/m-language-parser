import {
    runTestSuitesToEqual,
    runTestSuitesToBeNull,
} from "../../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import * as lexers from "../../../../../src/lexer/lexers/lexers.js";

describe("Shall parse.", () => {
    runTestSuitesToEqual(
        "./test/lexer/lexers/comment/delimetedComment/testCases",
        /^test-suite-/,
        lexers.getDelimitedCommentToken,
    );
});

describe("Shall not parse.", () => {
    runTestSuitesToBeNull(
        "./test/lexer/lexers/comment/delimetedComment/testCases",
        /^invalid-test-suite-/,
        lexers.getDelimitedCommentToken,
    );
});
