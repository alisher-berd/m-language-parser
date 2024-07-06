import fs from "fs";
import path from "path";
import { describe, expect, test } from "@jest/globals";

function loadTextFile(filePath) {
    try {
        return fs.readFileSync(filePath, "utf8");
    } catch (error) {
        throw new Error(
            `Failed to load or read file: ${filePath}\nError: ${error.message}`,
        );
    }
}

function loadJsonFile(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
        throw new Error(
            `Failed to load or parse file: ${filePath}\nError: ${error.message}`,
        );
    }
}

function saveAsTextFile(outputFilePath, data) {
    try {
        fs.writeFileSync(outputFilePath, data, "utf8");
    } catch (error) {
        console.error("Error writing output file:", error);
    }
}

function saveAsJsonFile(outputFilePath, data) {
    try {
        data = JSON.stringify(data, null, 4);
        fs.writeFileSync(outputFilePath, data, "utf8");
    } catch (error) {
        console.error("Error writing output file:", error);
    }
}

function setTestDescriptions(testSuite, fileName) {
    testSuite.description =
        testSuite.description || fileName.split(".")[0] || "Test suite.";

    if (testSuite.testCases === undefined || testSuite.testCases === null) {
        testSuite.testCases = [];
    }

    testSuite.testCases.forEach((testCase, index) => {
        let testCaseDescription = `Test case ${index}`;

        if (testCase.description) {
            testCaseDescription += `, ${testCase.description}`;
        }

        if (typeof testCase.input === "string") {
            let inputLines = testCase.input.split(/\r\n|\r|\n|\v|\f/).length;
            if (
                inputLines === 1 &&
                testCaseDescription.length + testCase.input.length <= 80
            ) {
                testCaseDescription += `: "${testCase.input}"`;
            }
        }

        testCase.description = testCaseDescription;
    });

    return testSuite;
}

function loadTestSuiteFromJson(filePath) {
    let testSuite = loadJsonFile(filePath);
    testSuite = setTestDescriptions(testSuite, path.basename(filePath));
    return testSuite;
}

function runTestSuite(testSuite, functionToTest, testFunction) {
    describe(testSuite.description, () => {
        testSuite.testCases.forEach((testCase) => {
            testFunction(testCase, functionToTest);
        });
    });
}

function loadTestCases(
    testCasesFolderPath,
    inputFileNameEndingPattern,
    inputFileLoader,
    outputFileloader,
) {
    let testCases = [];

    const inputFileNames = fs
        .readdirSync(testCasesFolderPath)
        .filter((fileName) => fileName.endsWith(inputFileNameEndingPattern));

    inputFileNames.forEach((inputFileName) => {
        const testCaseName = inputFileName.replace(
            inputFileNameEndingPattern,
            "",
        );

        const inputFilePath = path.join(testCasesFolderPath, inputFileName);

        const outputFileName = fs
            .readdirSync(testCasesFolderPath)
            .filter((fileName) => fileName.startsWith(testCaseName))
            .filter((fileName) => fileName !== inputFileName)[0];
        const outputFilePath = path.join(testCasesFolderPath, outputFileName);

        const input = inputFileLoader(inputFilePath);
        const output = outputFileloader(outputFilePath);

        const testCase = {
            description: inputFileName,
            input: input,
            output: output,
        };

        testCases.push(testCase);
    });

    return testCases;
}

function runTestCasesFromFiles(
    testCasesFolderPath,
    inputFileNameEndingPattern,
    inputFileLoader,
    outputFileloader,
    functionToTest,
    testFunction,
) {
    const testCases = loadTestCases(
        testCasesFolderPath,
        inputFileNameEndingPattern,
        inputFileLoader,
        outputFileloader,
    );

    testCases.forEach((testCase) => {
        testFunction(testCase, functionToTest);
    });
}

function runTestSuitesFromFiles(
    testSuitesFolderPath,
    fileNamePattern,
    functionToTest,
    testFunction,
) {
    const testCasesFiles = fs
        .readdirSync(testSuitesFolderPath)
        .filter((fileName) => fileNamePattern.test(fileName));

    testCasesFiles.forEach((inputFileName) => {
        const testSuite = loadTestSuiteFromJson(
            path.join(testSuitesFolderPath, inputFileName),
        );

        runTestSuite(testSuite, functionToTest, testFunction);
    });
}

function runTestSuitesToEqual(testCasesDir, fileNamePattern, functionToTest) {
    runTestSuitesFromFiles(
        testCasesDir,
        fileNamePattern,
        functionToTest,
        (testCase, functionToTest) => {
            test(testCase.description, () => {
                const result = functionToTest(testCase.input);
                expect(result).toEqual(testCase.output);
            });
        },
    );
}

function runTestSuitesToBeNull(testCasesDir, fileNamePattern, functionToTest) {
    runTestSuitesFromFiles(
        testCasesDir,
        fileNamePattern,
        functionToTest,
        (testCase, functionToTest) => {
            test(testCase.description, () => {
                const result = functionToTest(testCase.input);
                expect(result).toBeNull;
            });
        },
    );
}

function runTestSuitesToThrowError(
    testCasesDir,
    fileNamePattern,
    functionToTest,
) {
    runTestSuitesFromFiles(
        testCasesDir,
        fileNamePattern,
        functionToTest,
        (testCase, functionToTest) => {
            test(testCase.description, () => {
                expect(() => functionToTest(testCase.input)).toThrow();
            });
        },
    );
}

function runTestCasesToEqual(
    testCasesFolderPath,
    inputFileNameEndingPattern,
    inputFileLoader,
    outputFileloader,
    functionToTest,
) {
    runTestCasesFromFiles(
        testCasesFolderPath,
        inputFileNameEndingPattern,
        inputFileLoader,
        outputFileloader,
        functionToTest,
        (testCase, functionToTest) => {
            test(testCase.description, () => {
                const result = functionToTest(testCase.input);
                expect(result).toEqual(testCase.output);
            });
        },
    );
}

export {
    loadTextFile,
    loadJsonFile,
    saveAsTextFile,
    saveAsJsonFile,
    runTestSuitesToEqual,
    runTestSuitesToBeNull,
    runTestSuitesToThrowError,
    runTestCasesToEqual,
};
