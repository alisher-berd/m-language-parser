import { describe } from "@jest/globals";
import { loadJsonFile, runTestCasesToEqual } from "../../utils/testUtils.js";
import { filterTokens } from "../../../src/parser/parser.js";

describe("Test valid inputs", () => {
    runTestCasesToEqual(
        "./test/parser/filterTokens/testData",
        "-input.json",
        loadJsonFile,
        loadJsonFile,
        filterTokens,
    );
});
