import {
    runTestSuitesToEqual,
    runTestSuitesToBeNull,
} from "../../../../utils/testUtils.js";
import { describe } from "@jest/globals";
import * as lexers from "../../../../../src/lexer/lexers/lexers.js";

describe("Shall parse.", () => {
    runTestSuitesToEqual(
        "./test/lexer/lexers/comment/singleLineComment/testCases",
        /^test-suite-/,
        lexers.getSingleLineCommentToken,
    );
});

describe("Shall not parse.", () => {
    runTestSuitesToBeNull(
        "./test/lexer/lexers/comment/singleLineComment/testCases",
        /^invalid-test-suite-/,
        lexers.getSingleLineCommentToken,
    );
});
