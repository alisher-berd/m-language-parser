import { describe } from "@jest/globals";

import { testValidCases as testPrimitiveType } from "../23-parsePrimitiveType/parsePrimitiveType.js";
import { testValidCases as testListType } from "../24-parseListType/parseListType.js";
import { testValidCases as testRecordType } from "../29-parseRecordType/parseRecordType.js";
import { testValidCases as testTableType } from "../30-parseTableType/parseTableType.js";
import { testValidCases as testFunctionType } from "../39-parseFunctionType/parseFunctionType.js";
import { testValidCases as testNullableType } from "../40-parseNullableType/parseNullableType.js";

// primary-type:
//     primitive-type
//     list-type
//     record-type
//     table-type
//     function-type
//     nullable-type

export function testPrimaryType(parserFunction) {
    describe("primary-type", () => {
        testPrimitiveType(parserFunction);

        testListType(parserFunction);

        testRecordType(parserFunction);

        testTableType(parserFunction);

        testFunctionType(parserFunction);

        testNullableType(parserFunction);
    });
}
