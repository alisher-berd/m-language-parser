import {
    TokenType,
    Identifier,
    OperatorOrPunctuator,
    Keyword,
    operatorOrPuctuatorToTokenMapping,
} from "../../language/tokens.js";

import * as nodeClasses from "../../language/nodes.js";

import { regexGeneralizedIdentifier } from "../../lexer/lexers/lexicalStructure.js";

import {
    nextTokenIs,
    nextTokenTypeIs,
    nextTokenValueIs,
} from "./helpers/parser-helpers.js";

// ------------------------------------------
// PRIMARY-EXPRESSION
// ------------------------------------------

// expression.logical-or-expression.logical-and-expression.is-expression.as-expression
//   .equality-expressionrelational-expression.additive-expression.multiplicative-expression
//   .metadata-expression.unary-expression.type-expression.primary-expression

// NOT-IMPLEMENTED-EXPRESSION

// primary-expression.not-implemented-expression
// not-implemented-expression:
//   ...

export function parseNotImplementedExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenIs(OperatorOrPunctuator.TripleDot, tokens, pointer)) {
        pointer += 1;

        node = new nodeClasses.NotImplementedExpression(startIndex, pointer);
    }

    return node;
}

// SECTION-ACCESS-EXPRESSION

// primary-expression.section-access-expression
// section-access-expression:
//   identifier ! identifier
export function parseSectionAccessExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenTypeIs(TokenType.Identifier, tokens, pointer)) {
        const firstIdentifierName = tokens[pointer].value;
        pointer += 1;

        if (
            nextTokenIs(OperatorOrPunctuator.ExclamationMark, tokens, pointer)
        ) {
            pointer += 1;

            if (nextTokenTypeIs(TokenType.Identifier, tokens, pointer)) {
                const secondIdentifierName = tokens[pointer].value;
                pointer += 1;

                node = new nodeClasses.SectionAccessExpression(
                    startIndex,
                    pointer,
                    firstIdentifierName,
                    secondIdentifierName,
                );
            }
        }
    }

    return node;
}

// IDENTIFIER-EXPRESSION

// primary-expression.identifier-expression
// identifier-expression:
//   identifier-reference:
//     exclusive-identifier-reference:
//       identifier
//     inclusive-identifier-reference:
//       @ identifier

export function parseIdentifierExpression(tokens, startIndex) {
    let node = null;
    let isInclusive = false;
    let pointer = startIndex;

    if (node === null) {
        if (
            nextTokenIs(Keyword.Binary, tokens, pointer) ||
            nextTokenIs(Keyword.Datetimezone, tokens, pointer) ||
            nextTokenIs(Keyword.Datetime, tokens, pointer) ||
            nextTokenIs(Keyword.Date, tokens, pointer) ||
            nextTokenIs(Keyword.Duration, tokens, pointer) ||
            nextTokenIs(Keyword.Table, tokens, pointer) ||
            nextTokenIs(Keyword.Time, tokens, pointer)
        ) {
            const identifierName = tokens[pointer].value;
            pointer += 1;

            node = new nodeClasses.IdentifierExpression(
                startIndex,
                pointer,
                identifierName,
                isInclusive,
            );
        }
    }

    if (node === null) {
        if (nextTokenIs(OperatorOrPunctuator.AtSymbol, tokens, pointer)) {
            isInclusive = true;
            pointer += 1;
        }

        if (nextTokenTypeIs(TokenType.Identifier, tokens, pointer)) {
            const identifierName = tokens[pointer].value;
            pointer += 1;

            node = new nodeClasses.IdentifierExpression(
                startIndex,
                pointer,
                identifierName,
                isInclusive,
            );
        }
    }

    return node;
}

// LITERAL-EXPRESSION

// primary-expression.literal-expression
// literal-expression:
//   literal
export function parseLiteralExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenTypeIs(TokenType.Literal, tokens, pointer)) {
        const literalValue = tokens[pointer].value;
        const literalType = tokens[pointer].token;
        pointer += 1;

        node = new nodeClasses.LiteralExpression(
            startIndex,
            pointer,
            literalValue,
            literalType,
        );
    }

    return node;
}

// PARENTHESIZED-EXPRESSION

// primary-expression.parenthesized-expression
// parenthesized-expression:
//   ( expression )
export function parseParenthesizedExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenIs(OperatorOrPunctuator.OpeningParenthesis, tokens, pointer)) {
        pointer += 1;

        const expression = parseExpression(tokens, pointer);
        if (expression) {
            pointer = expression.stopIndex;

            if (
                nextTokenIs(
                    OperatorOrPunctuator.ClosingParenthesis,
                    tokens,
                    pointer,
                )
            ) {
                pointer += 1;

                node = expression;
                node.startIndex = startIndex;
                node.stopIndex = pointer;
            }
        }
    }

    return node;
}

// INVOKE-EXPRESSION

// primary-expression.invoke-expression.arugment-list
// argument-list:
//   expression
//   expression , argument-list
export function parseArgumentList(tokens, startIndex) {
    let node = null;
    let argumentList = [];
    let pointer = startIndex;

    const expression = parseExpression(tokens, pointer);
    if (expression) {
        pointer = expression.stopIndex;
        argumentList.push(expression);

        if (nextTokenIs(OperatorOrPunctuator.Comma, tokens, pointer)) {
            pointer += 1;

            const remainingArgumentList = parseArgumentList(tokens, pointer);
            if (remainingArgumentList) {
                pointer = remainingArgumentList.stopIndex;
                argumentList = argumentList.concat(
                    remainingArgumentList.argumentList,
                );

                node = new nodeClasses.ArgumentList(
                    startIndex,
                    pointer,
                    argumentList,
                );
            }
        }
        // else end parsing argument list
        else {
            node = new nodeClasses.ArgumentList(
                startIndex,
                pointer,
                argumentList,
            );
        }
    }

    return node;
}

// primary-expression.invoke-expression
// invoke-expression:
//   primary-expression ( argument-list(opt) )
export function parseInvokeExpressionArgumentList(tokens, startIndex) {
    let node = null;
    let argumentList = [];
    let pointer = startIndex;

    if (nextTokenIs(OperatorOrPunctuator.OpeningParenthesis, tokens, pointer)) {
        pointer += 1;

        const argumentListNode = parseArgumentList(tokens, pointer);
        if (argumentListNode) {
            pointer = argumentListNode.stopIndex;
            argumentList = argumentListNode.argumentList;
        }

        if (
            nextTokenIs(
                OperatorOrPunctuator.ClosingParenthesis,
                tokens,
                pointer,
            )
        ) {
            pointer += 1;

            node = new nodeClasses.InvokeExpressionArgumentList(
                startIndex,
                pointer,
                argumentList,
            );
        }
    }

    return node;
}

// LIST-EXPRESSION

// primary-expression.list-expression.item-list.item (item | sequence-item)
// item:
//   expression
//   expression .. expression
export function parseItem(tokens, startIndex) {
    let node = null;
    let isSequenceItem = false;
    let secondExpression = null;
    let pointer = startIndex;

    const expression = parseExpression(tokens, pointer);
    if (expression) {
        pointer = expression.stopIndex;

        if (nextTokenIs(OperatorOrPunctuator.DoubleDot, tokens, pointer)) {
            secondExpression = parseExpression(tokens, pointer + 1);

            if (secondExpression) {
                pointer = secondExpression.stopIndex;
                isSequenceItem = true;
            }
        }

        node = new nodeClasses.Item(
            startIndex,
            pointer,
            expression,
            isSequenceItem,
            secondExpression,
        );
    }

    return node;
}

// primary-expression.list-expression.item-list
// item-list:
//   item
//   item , item-list
export function parseItemList(tokens, startIndex) {
    let node = null;
    let itemList = [];
    let pointer = startIndex;

    const item = parseItem(tokens, pointer);
    if (item) {
        pointer = item.stopIndex;
        itemList.push(item);

        // if next token is comma, parse tokens after the commma recursively
        if (nextTokenIs(OperatorOrPunctuator.Comma, tokens, pointer)) {
            const remainingItemList = parseItemList(tokens, pointer + 1);

            if (remainingItemList) {
                pointer = remainingItemList.stopIndex;
                itemList = itemList.concat(remainingItemList.itemList);

                node = new nodeClasses.ItemList(startIndex, pointer, itemList);
            }
        }
        // else end parsing argument list
        else {
            node = new nodeClasses.ItemList(startIndex, pointer, itemList);
        }
    }

    return node;
}

// primary-expression.list-expression
// list-expression:
//   { item-list(opt) }
export function parseListExpression(tokens, startIndex) {
    let node = null;
    let itemList = [];
    let pointer = startIndex;

    if (nextTokenIs(OperatorOrPunctuator.OpeningBrace, tokens, pointer)) {
        pointer += 1;

        const itemListNode = parseItemList(tokens, pointer);
        if (itemListNode) {
            pointer = itemListNode.stopIndex;
            itemList = itemListNode.itemList;
        }

        if (nextTokenIs(OperatorOrPunctuator.ClosingBrace, tokens, pointer)) {
            pointer += 1;

            node = new nodeClasses.ListExpression(
                startIndex,
                pointer,
                itemList,
            );
        }
    }

    return node;
}

// RECORD EXPRESSION

// primary-expression.record-expression.field-list.field.field-name
// field-name:
//   generalized-identifier
//   quoted-identifier

export function parseFieldName(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    // all keywords can be valid field names
    if (node === null) {
        if (nextTokenTypeIs(TokenType.Keyword, tokens, pointer)) {
            const fieldNameValue = tokens[pointer].value;
            pointer += 1;

            node = new nodeClasses.FieldName(
                startIndex,
                pointer,
                fieldNameValue,
            );
        }
    }

    // all generalized identifiers and quoted identifiers can be valid field names
    if (node === null) {
        if (
            nextTokenIs(Identifier.Generalized, tokens, pointer) ||
            nextTokenIs(Identifier.Quoted, tokens, pointer)
        ) {
            const fieldNameValue = tokens[pointer].value;
            pointer += 1;

            node = new nodeClasses.FieldName(
                startIndex,
                pointer,
                fieldNameValue,
            );
        }
    }

    // some regular identifiers can be valid field names
    // the ones using dots cannot be
    if (node === null) {
        if (nextTokenIs(Identifier.Regular, tokens, pointer)) {
            const fieldNameValue = tokens[pointer].value;

            if (regexGeneralizedIdentifier.test(fieldNameValue)) {
                pointer += 1;

                node = new nodeClasses.FieldName(
                    startIndex,
                    pointer,
                    fieldNameValue,
                );
            }
        }
    }

    // recursively identify field name parts separated by spaces
    // TODO: add a check whether spacing was using u0020 only
    if (node) {
        const nextFieldNameNode = parseFieldName(tokens, pointer);
        if (nextFieldNameNode) {
            pointer = nextFieldNameNode.stopIndex;
            const fieldNameValue = `${node.fieldName} ${nextFieldNameNode.fieldName}`;

            node = new nodeClasses.FieldName(
                startIndex,
                pointer,
                fieldNameValue,
            );
        }
    }

    return node;
}

// primary-expression.record-expression.field-list.field
// field:
//   field-name = expression
export function parseField(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    const fieldNameNode = parseFieldName(tokens, pointer);
    if (fieldNameNode) {
        pointer = fieldNameNode.stopIndex;

        if (nextTokenIs(OperatorOrPunctuator.Equal, tokens, pointer)) {
            pointer += 1;

            const expression = parseExpression(tokens, pointer);
            if (expression) {
                pointer = expression.stopIndex;

                node = new nodeClasses.Field(
                    startIndex,
                    pointer,
                    fieldNameNode.fieldName,
                    expression,
                );
            }
        }
    }

    return node;
}

// primary-expression.record-expression.field-list
// field-list:
//   field
//   field , field-list
export function parseFieldList(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    const field = parseField(tokens, pointer);
    if (field) {
        pointer = field.stopIndex;

        // if next token is comma, parse tokens after the commma recursively
        if (nextTokenIs(OperatorOrPunctuator.Comma, tokens, pointer)) {
            pointer += 1;

            const remainingFieldList = parseFieldList(tokens, pointer);
            if (remainingFieldList) {
                pointer = remainingFieldList.stopIndex;

                node = new nodeClasses.FieldList(
                    startIndex,
                    pointer,
                    [
                        {
                            fieldName: field.fieldName,
                            expression: field.expression,
                        },
                    ].concat(remainingFieldList.fieldList),
                );
            }
        }
        // else end parsing
        else {
            node = new nodeClasses.FieldList(startIndex, pointer, [
                {
                    fieldName: field.fieldName,
                    expression: field.expression,
                },
            ]);
        }
    }

    return node;
}

// primary-expression.record-expression
// record-expression:
//   [ field-list(opt) ]
export function parseRecordExpression(tokens, startIndex) {
    let node = null;
    let fieldList = [];
    let pointer = startIndex;

    if (nextTokenIs(OperatorOrPunctuator.OpeningBracket, tokens, pointer)) {
        pointer += 1;

        const fieldListNode = parseFieldList(tokens, pointer);
        if (fieldListNode) {
            pointer = fieldListNode.stopIndex;
            fieldList = fieldListNode.fieldList;
        }

        if (nextTokenIs(OperatorOrPunctuator.ClosingBracket, tokens, pointer)) {
            pointer += 1;

            node = new nodeClasses.RecordExpression(
                startIndex,
                pointer,
                fieldList,
            );
        }
    }

    return node;
}

// ITEM ACCESS EXPRESSION

// primary-expression.item-access-expression.(item-selection | optional-item-selection)
// item-selection:
//   primary-expression { item-selector }
// optional-item-selection:
//   primary-expression { item-selector } ?
// item-selector:
//   expression

export function parseItemAccessExpressionItemSelector(tokens, startIndex) {
    let node = null;
    let isOptionalSelection = false;
    let pointer = startIndex;

    if (nextTokenIs(OperatorOrPunctuator.OpeningBrace, tokens, pointer)) {
        pointer += 1;

        const itemSelector = parseExpression(tokens, pointer);
        if (itemSelector) {
            pointer = itemSelector.stopIndex;

            if (
                nextTokenIs(OperatorOrPunctuator.ClosingBrace, tokens, pointer)
            ) {
                pointer += 1;

                if (
                    nextTokenIs(
                        OperatorOrPunctuator.QuestionMark,
                        tokens,
                        pointer,
                    )
                ) {
                    pointer += 1;
                    isOptionalSelection = true;
                }

                node = new nodeClasses.ItemAccessExpressionItemSelector(
                    startIndex,
                    pointer,
                    itemSelector,
                    isOptionalSelection,
                );
            }
        }
    }

    return node;
}

// FIELD ACCESS EXPRESSION

// primary-expression.field-access-expression.(field-selection | implicit-target-field-selection).field-selector.required-field-selector
// required-field-selector:
//   [ field-name ]
export function parseRequiredFieldSelector(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenIs(OperatorOrPunctuator.OpeningBracket, tokens, pointer)) {
        pointer += 1;

        const fieldNameNode = parseFieldName(tokens, pointer);
        if (fieldNameNode) {
            pointer = fieldNameNode.stopIndex;

            if (
                nextTokenIs(
                    OperatorOrPunctuator.ClosingBracket,
                    tokens,
                    pointer,
                )
            ) {
                pointer += 1;

                node = new nodeClasses.RequiredFieldSelector(
                    startIndex,
                    pointer,
                    fieldNameNode.fieldName,
                );
            }
        }
    }

    return node;
}

// primary-expression.field-access-expression.implicit-target-field-selection
// implicit-target-field-selection:
//   field-selector:
//     required-field-selector:
//       [ field-name ]
//     optional-field-selector:
//       [ field-name ] ?
export function parseImplicitTargetFieldSelection(tokens, startIndex) {
    let node = null;
    let isOptionalSelection = false;
    let pointer = startIndex;

    const requiredFieldSelector = parseRequiredFieldSelector(tokens, pointer);
    if (requiredFieldSelector) {
        pointer = requiredFieldSelector.stopIndex;

        if (nextTokenIs(OperatorOrPunctuator.QuestionMark, tokens, pointer)) {
            pointer += 1;
            isOptionalSelection = true;
        }

        node = new nodeClasses.ImplicitTargetFieldSelection(
            startIndex,
            pointer,
            requiredFieldSelector.fieldName,
            isOptionalSelection,
        );
    }

    return node;
}

// primary-expression.field-access-expression.implicit-target-projection.required-projection.required-selector-list
// required-selector-list:
//   required-field-selector
//   required-field-selector , required-selector-list
export function parseRequiredSelectorList(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    const requiredFieldSelector = parseRequiredFieldSelector(tokens, pointer);
    if (requiredFieldSelector) {
        pointer = requiredFieldSelector.stopIndex;

        // recursive part
        if (nextTokenIs(OperatorOrPunctuator.Comma, tokens, pointer)) {
            pointer += 1;

            const remainingRequiredSelectorList = parseRequiredSelectorList(
                tokens,
                pointer,
            );
            if (remainingRequiredSelectorList) {
                pointer = remainingRequiredSelectorList.stopIndex;

                node = new nodeClasses.RequiredSelectorList(
                    startIndex,
                    pointer,
                    [requiredFieldSelector.fieldName].concat(
                        remainingRequiredSelectorList.requiredSelectorList,
                    ),
                );
            }
        }
        // else end parsing
        else {
            node = new nodeClasses.RequiredSelectorList(startIndex, pointer, [
                requiredFieldSelector.fieldName,
            ]);
        }
    }

    return node;
}

// primary-expression.field-access-expression.implicit-target-projectio.required-projection
// required-projection:
//   [ required-selector-list ]
export function parseRequiredProjection(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenIs(OperatorOrPunctuator.OpeningBracket, tokens, pointer)) {
        pointer += 1;

        const requiredSelectorListNode = parseRequiredSelectorList(
            tokens,
            pointer,
        );
        if (requiredSelectorListNode) {
            pointer = requiredSelectorListNode.stopIndex;

            if (
                nextTokenIs(
                    OperatorOrPunctuator.ClosingBracket,
                    tokens,
                    pointer,
                )
            ) {
                pointer += 1;

                node = new nodeClasses.RequiredProjection(
                    startIndex,
                    pointer,
                    requiredSelectorListNode.requiredSelectorList,
                );
            }
        }
    }

    return node;
}

// primary-expression.field-access-expression.implicit-target-projection
// implicit-target-projection:
//   required-projection:
//     [ required-selector-list ]
//   optional-projection:d
//     [ required-selector-list ] ?
export function parseImplicitTargetProjection(tokens, startIndex) {
    let node = null;
    let isOptionalSelection = false;
    let pointer = startIndex;

    const requiredProjection = parseRequiredProjection(tokens, pointer);
    if (requiredProjection) {
        pointer = requiredProjection.stopIndex;

        if (nextTokenIs(OperatorOrPunctuator.QuestionMark, tokens, pointer)) {
            pointer += 1;
            isOptionalSelection = true;
        }

        node = new nodeClasses.ImplicitTargetProjection(
            startIndex,
            pointer,
            requiredProjection.requiredSelectorList,
            isOptionalSelection,
        );
    }

    return node;
}

// primary-expression.field-access-expression.implicit-target-field-selection
// primary-expression.field-access-expression.implicit-target-projection
export function parseImplicitFieldAccessExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (node === null) {
        const implicitTargetFieldSelection = parseImplicitTargetFieldSelection(
            tokens,
            pointer,
        );
        if (implicitTargetFieldSelection) {
            pointer = implicitTargetFieldSelection.stopIndex;

            node = new nodeClasses.FieldAccessExpression(
                startIndex,
                pointer,
                null,
                implicitTargetFieldSelection.fieldName,
                null,
                implicitTargetFieldSelection.isOptionalSelection,
            );
        }
    }

    if (node === null) {
        const implicitTargetProjection = parseImplicitTargetProjection(
            tokens,
            pointer,
        );
        if (implicitTargetProjection) {
            pointer = implicitTargetProjection.stopIndex;

            node = new nodeClasses.FieldAccessExpression(
                startIndex,
                pointer,
                null,
                null,
                implicitTargetProjection.requiredSelectorList,
                implicitTargetProjection.isOptionalSelection,
            );
        }
    }

    return node;
}

// PRIMARY EXPRESSION
// primary-expression:
//   literal-expression
//   list-expression
//   record-expression
//   identifier-expression
//   section-access-expression
//   parenthesized-expression
//   field-access-expression
//   item-access-expression
//   invoke-expression
//   not-implemented-expression

export function parsePrimaryExpression(
    tokens,
    startIndex,
    previousPrimaryExpression = null,
) {
    let primaryExpression = null;
    let pointer = startIndex;

    // not entered recursion yet, first call
    if (previousPrimaryExpression === null) {
        // not-implemented-expression
        if (primaryExpression === null) {
            primaryExpression = parseNotImplementedExpression(tokens, pointer);
        }

        // literal-expression
        if (primaryExpression === null) {
            primaryExpression = parseLiteralExpression(tokens, pointer);
        }

        // section-access-expression
        // section-access-expression shall be tested before identifier-expression
        if (primaryExpression === null) {
            primaryExpression = parseSectionAccessExpression(tokens, pointer);
        }

        // identifier-expression
        if (primaryExpression === null) {
            primaryExpression = parseIdentifierExpression(tokens, pointer);
        }

        // list-expression
        if (primaryExpression === null) {
            primaryExpression = parseListExpression(tokens, pointer);
        }

        // record-expression
        if (primaryExpression === null) {
            primaryExpression = parseRecordExpression(tokens, pointer);
        }

        // parenthesized-expression
        if (primaryExpression === null) {
            primaryExpression = parseParenthesizedExpression(tokens, pointer);
        }

        // implicit-field-access-expression
        if (primaryExpression === null) {
            primaryExpression = parseImplicitFieldAccessExpression(
                tokens,
                pointer,
            );
        }
    }
    // this is part of a recursive call
    else {
        // invoke-expression
        if (primaryExpression === null) {
            const invokeExpressionArgumentList =
                parseInvokeExpressionArgumentList(tokens, pointer);

            if (invokeExpressionArgumentList) {
                pointer = invokeExpressionArgumentList.stopIndex;

                primaryExpression = new nodeClasses.InvokeExpression(
                    startIndex, // TODO: change to previousPrimaryExpression.startIndex, check in other recursive definitions, update tests accordingly
                    pointer,
                    previousPrimaryExpression,
                    invokeExpressionArgumentList.argumentList,
                );
            }
        }

        // item-access-expression
        if (primaryExpression === null) {
            const itemAccessExpressionItemSelector =
                parseItemAccessExpressionItemSelector(tokens, pointer);

            if (itemAccessExpressionItemSelector) {
                pointer = itemAccessExpressionItemSelector.stopIndex;

                primaryExpression = new nodeClasses.ItemAccessExpression(
                    startIndex,
                    pointer,
                    previousPrimaryExpression,
                    itemAccessExpressionItemSelector.itemSelector,
                    itemAccessExpressionItemSelector.isOptionalSelection,
                );
            }
        }

        // field-access-expression
        if (primaryExpression === null) {
            const implicitFieldAccessExpression =
                parseImplicitFieldAccessExpression(tokens, pointer);

            if (implicitFieldAccessExpression) {
                pointer = implicitFieldAccessExpression.stopIndex;

                primaryExpression = new nodeClasses.FieldAccessExpression(
                    startIndex,
                    pointer,
                    previousPrimaryExpression,
                    implicitFieldAccessExpression.implicitTargetFieldSelection,
                    implicitFieldAccessExpression.implicitTargetProjection,
                    implicitFieldAccessExpression.isOptionalSelection,
                );
            }
        }
    }

    // start the recursion here
    if (primaryExpression) {
        pointer = primaryExpression.stopIndex;

        const parentPrimaryExpression = parsePrimaryExpression(
            tokens,
            pointer,
            primaryExpression,
        );
        if (parentPrimaryExpression) {
            primaryExpression = parentPrimaryExpression;
        }
    }

    return primaryExpression;
}

// ------------------------------------------
// TYPE EXPRESSION
// ------------------------------------------

// expression.logical-or-expression.logical-and-expression.is-expression.as-expression
//   .equality-expressionrelational-expression.additive-expression.multiplicative-expression
//   .metadata-expression.unary-expression.type-expression

//  PRIMITIVE TYPE

const PrimitiveTypes = [
    "any",
    "anynonnull",
    "binary",
    "date",
    "datetime",
    "datetimezone",
    "duration",
    "function",
    "list",
    "logical",
    "none",
    "null",
    "number",
    "record",
    "table",
    "text",
    "time",
    "type",
];

// type-expression.primary-type.primitive-type
// primitive-type:
//   one of PrimitiveTypes
export function parsePrimitiveType(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (
        nextTokenTypeIs(TokenType.Keyword, tokens, pointer) ||
        nextTokenTypeIs(TokenType.Identifier, tokens, pointer)
    ) {
        const primitiveType = tokens[pointer].value;
        pointer += 1;

        if (PrimitiveTypes.includes(primitiveType)) {
            node = new nodeClasses.PrimitiveType(
                startIndex,
                pointer,
                primitiveType,
            );
        }
    }

    return node;
}

// LIST TYPE

// type-expression.primary-type.list-type
// list-type:
//   { item-type }
// item-type:
//   type
export function parseListType(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenIs(OperatorOrPunctuator.OpeningBrace, tokens, pointer)) {
        pointer += 1;

        const itemType = parseType(tokens, pointer);
        if (itemType) {
            pointer = itemType.stopIndex;

            if (
                nextTokenIs(OperatorOrPunctuator.ClosingBrace, tokens, pointer)
            ) {
                pointer += 1;

                node = new nodeClasses.ListType(startIndex, pointer, itemType);
            }
        }
    }

    return node;
}

// RECORD-TYPE

// type-expression.primary-type.record-type.open-record-marker
// open-record-marker:
//   ...
export function parseOpenRecordMarker(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenIs(OperatorOrPunctuator.TripleDot, tokens, pointer)) {
        pointer += 1;

        node = new nodeClasses.OpenRecordMarker(startIndex, pointer);
    }

    return node;
}

// type-expression.primary-type.record-type.field-specification-list.field-specification.field-type-specification
// field-type-specification:
//   = field-type
// field-type:
//   type
export function parseFieldTypeSpecification(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenIs(OperatorOrPunctuator.Equal, tokens, pointer)) {
        pointer += 1;

        const fieldType = parseType(tokens, pointer);
        if (fieldType) {
            pointer = fieldType.stopIndex;

            node = new nodeClasses.FieldTypeSpecification(
                startIndex,
                pointer,
                fieldType,
            );
        }
    }

    return node;
}

// type-expression.primary-type.record-type.field-specification-list.field-specification
// field-specification:
//   [optional](opt) field-name field-type-specification(opt)

export function parseFieldSpecification(tokens, startIndex) {
    let node = null;
    let fieldType = null;
    let isOptional = false;
    let pointer = startIndex;

    if (nextTokenValueIs("optional", tokens, pointer)) {
        pointer += 1;
        isOptional = true;
    }

    const fieldNameNode = parseFieldName(tokens, pointer);
    if (fieldNameNode) {
        pointer = fieldNameNode.stopIndex;

        const fieldTypeSpecification = parseFieldTypeSpecification(
            tokens,
            pointer,
        );
        if (fieldTypeSpecification) {
            pointer = fieldTypeSpecification.stopIndex;
            fieldType = fieldTypeSpecification.fieldType;
        }

        node = new nodeClasses.FieldSpecification(
            startIndex,
            pointer,
            fieldNameNode.fieldName,
            fieldType,
            isOptional,
        );
    }

    return node;
}

// type-expression.primary-type.record-type.field-specification-list
// field-specification-list:
//   field-specification
//   field-specification , field-specification-list
export function parseFieldSpecificationList(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    const fieldSpecification = parseFieldSpecification(tokens, pointer);
    if (fieldSpecification) {
        pointer = fieldSpecification.stopIndex;

        // recursion
        if (nextTokenIs(OperatorOrPunctuator.Comma, tokens, pointer)) {
            const remainingFieldSpecificationList = parseFieldSpecificationList(
                tokens,
                pointer + 1,
            );

            if (remainingFieldSpecificationList) {
                pointer = remainingFieldSpecificationList.stopIndex;

                node = new nodeClasses.FieldSpecificationList(
                    startIndex,
                    pointer,
                    [
                        {
                            fieldName: fieldSpecification.fieldName,
                            fieldType: fieldSpecification.fieldType,
                            isOptional: fieldSpecification.isOptional,
                        },
                    ].concat(
                        remainingFieldSpecificationList.fieldSpecificationList,
                    ),
                );
            }
            // else there is a comma but tokens after the comma can't be parsed as field specification list
            // case: [ field-specification-list , open-record-marker ]
            else {
                node = new nodeClasses.FieldSpecificationList(
                    startIndex,
                    pointer,
                    [
                        {
                            fieldName: fieldSpecification.fieldName,
                            fieldType: fieldSpecification.fieldType,
                            isOptional: fieldSpecification.isOptional,
                        },
                    ],
                );
            }
        }
        // else end parsing list
        else {
            node = new nodeClasses.FieldSpecificationList(startIndex, pointer, [
                {
                    fieldName: fieldSpecification.fieldName,
                    fieldType: fieldSpecification.fieldType,
                    isOptional: fieldSpecification.isOptional,
                },
            ]);
        }
    }

    return node;
}

// type-expression.primary-type.record-type
// record-type:
//   [ open-record-marker ]
//   [ field-specification-list(opt) ]
//   [ field-specification-list , open-record-marker ]
export function parseRecordType(tokens, startIndex) {
    let node = null;
    let fieldSpecificationList = [];
    let hasOpenRecordMarker = false;
    let pointer = startIndex;

    if (nextTokenIs(OperatorOrPunctuator.OpeningBracket, tokens, pointer)) {
        pointer += 1;

        // [ open-record-marker ]
        if (node === null) {
            const openRecordMarker = parseOpenRecordMarker(tokens, pointer);
            if (openRecordMarker) {
                pointer = openRecordMarker.stopIndex;
                hasOpenRecordMarker = true;
            }
        }

        // [ field-specification-list , open-record-marker ]
        // [ field-specification-list]
        // [ ]
        if (node === null) {
            const fieldSpecificationListNode = parseFieldSpecificationList(
                tokens,
                pointer,
            );
            // [ field-specification-list , open-record-marker ]
            // [ field-specification-list]
            if (fieldSpecificationListNode) {
                pointer = fieldSpecificationListNode.stopIndex;
                fieldSpecificationList =
                    fieldSpecificationListNode.fieldSpecificationList;

                if (nextTokenIs(OperatorOrPunctuator.Comma, tokens, pointer)) {
                    const openRecordMarker = parseOpenRecordMarker(
                        tokens,
                        pointer + 1,
                    );
                    // [ field-specification-list , open-record-marker ]
                    if (openRecordMarker) {
                        pointer = openRecordMarker.stopIndex;
                        hasOpenRecordMarker = true;
                    }
                }
                // else [ field-specification-list]
            }
            // else [ ]
        }

        if (nextTokenIs(OperatorOrPunctuator.ClosingBracket, tokens, pointer)) {
            pointer += 1;

            node = new nodeClasses.RecordType(
                startIndex,
                pointer,
                hasOpenRecordMarker,
                fieldSpecificationList,
            );
        }
    }

    return node;
}

// TABLE TYPE

// type-expression.primary-type.table-type
// table-type:
//   table [ field-specification-list(opt) ]
export function parseTableType(tokens, startIndex) {
    let node = null;
    let fieldSpecificationList = [];
    let pointer = startIndex;

    if (nextTokenValueIs("table", tokens, pointer)) {
        pointer += 1;

        if (nextTokenIs(OperatorOrPunctuator.OpeningBracket, tokens, pointer)) {
            pointer += 1;

            const fieldSpecificationListNode = parseFieldSpecificationList(
                tokens,
                pointer,
            );
            if (fieldSpecificationListNode) {
                pointer = fieldSpecificationListNode.stopIndex;
                fieldSpecificationList =
                    fieldSpecificationListNode.fieldSpecificationList;
            }

            if (
                nextTokenIs(
                    OperatorOrPunctuator.ClosingBracket,
                    tokens,
                    pointer,
                )
            ) {
                pointer += 1;

                node = new nodeClasses.TableType(
                    startIndex,
                    pointer,
                    fieldSpecificationList,
                );
            }
        }
    }

    return node;
}

// export function TYPE

// type-expression.primary-type.function-type.parameter-specification-list.parameter-specification.parameter-name
// parameter-name:
//   identifier
export function parseParameterName(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (
        nextTokenIs(Identifier.Quoted, tokens, pointer) ||
        nextTokenIs(Identifier.Regular, tokens, pointer)
    ) {
        const parameterNameValue = tokens[pointer].value;
        pointer += 1;

        node = new nodeClasses.ParameterName(
            startIndex,
            pointer,
            parameterNameValue,
        );
    }

    return node;
}

// type-expression.primary-type.function-type.parameter-specification-list.parameter-specification.parameter-type.assertion.nullable-primitive-type
// as-expression.nullable-primitive-type
// nullable-primitive-type:
//   nullable(opt) primitive-type
export function parseNullablePrimitiveType(tokens, startIndex) {
    let node = null;
    let nullableFlag = false;
    let pointer = startIndex;

    if (nextTokenValueIs("nullable", tokens, pointer)) {
        pointer += 1;
        nullableFlag = true;
    }

    const primitiveTypeNode = parsePrimitiveType(tokens, pointer);
    if (primitiveTypeNode) {
        pointer = primitiveTypeNode.stopIndex;

        node = new nodeClasses.NullablePrimitiveType(
            startIndex,
            pointer,
            nullableFlag,
            primitiveTypeNode.primitiveType,
        );
    }

    return node;
}

// type-expression.primary-type.function-type.return-type
// assertion:
//   as nullable-primitive-type
export function parsePrimitiveAssertion(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenIs(Keyword.As, tokens, pointer)) {
        pointer += 1;

        const nullablePrimitiveType = parseNullablePrimitiveType(
            tokens,
            pointer,
        );
        if (nullablePrimitiveType) {
            pointer = nullablePrimitiveType.stopIndex;

            node = new nodeClasses.PrimitiveAssertion(
                startIndex,
                pointer,
                nullablePrimitiveType.nullableFlag,
                nullablePrimitiveType.primitiveType,
            );
        }
    }

    return node;
}

// type-expression.primary-type.function-type.parameter-specification-list.parameter-specification.parameter-type.assertion
// assertion:
//   as type
export function parseAssertion(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenIs(Keyword.As, tokens, pointer)) {
        pointer += 1;

        const typeNode = parsePrimitiveType(tokens, pointer);
        if (typeNode) {
            pointer = typeNode.stopIndex;

            node = new nodeClasses.Assertion(startIndex, pointer, typeNode);
        }
    }

    return node;
}

// type-expression.primary-type.function-type.parameter-specification-list.parameter-specification
// parameter-specification:
//   parameter-name parameter-type
// parameter-type:
//   assertion
export function parseParameterSpecification(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    const parameterNameNode = parseParameterName(tokens, pointer);
    if (parameterNameNode) {
        pointer = parameterNameNode.stopIndex;

        const parameterTypeNode = parseAssertion(tokens, pointer);
        if (parameterTypeNode) {
            pointer = parameterTypeNode.stopIndex;

            node = new nodeClasses.ParameterSpecification(
                startIndex,
                pointer,
                parameterNameNode.parameterName,
                parameterTypeNode.typeNode,
                false,
            );
        }
    }

    return node;
}

// type-expression.primary-type.function-type.parameter-specification-list.optional-parameter-specifican
// optional-parameter-specification:
//   [optional] parameter-specification
export function parseOptionalParameterSpecification(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenValueIs("optional", tokens, pointer)) {
        pointer += 1;

        const parameterSpecification = parseParameterSpecification(
            tokens,
            pointer,
        );
        if (parameterSpecification) {
            pointer = parameterSpecification.stopIndex;

            node = new nodeClasses.ParameterSpecification(
                startIndex,
                pointer,
                parameterSpecification.parameterName,
                parameterSpecification.parameterType,
                true,
            );
        }
    }

    return node;
}

// type-expression.primary-type.function-type.parameter-specification-list.optional-parameter-specification-list
// optional-parameter-specification-list:
//   optional-parameter-specification
//   optional-parameter-specification , optional-parameter-specification-list
export function parseOptionalParameterSpecificationList(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    const optionalParameterSpecification = parseOptionalParameterSpecification(
        tokens,
        pointer,
    );
    if (optionalParameterSpecification) {
        pointer = optionalParameterSpecification.stopIndex;

        if (nextTokenIs(OperatorOrPunctuator.Comma, tokens, pointer)) {
            pointer += 1;

            const remainingOptionalParameterSpecificationList =
                parseOptionalParameterSpecificationList(tokens, pointer);
            if (remainingOptionalParameterSpecificationList) {
                pointer = remainingOptionalParameterSpecificationList.stopIndex;

                node = new nodeClasses.OptionalParameterSpecificationList(
                    startIndex,
                    pointer,
                    [
                        {
                            parameterName:
                                optionalParameterSpecification.parameterName,
                            parameterType:
                                optionalParameterSpecification.parameterType,
                            isOptional:
                                optionalParameterSpecification.isOptional,
                        },
                    ].concat(
                        remainingOptionalParameterSpecificationList.optionalParameterSpecificationList,
                    ),
                );
            }
        }
        // else end parsing list
        else {
            node = new nodeClasses.OptionalParameterSpecificationList(
                startIndex,
                pointer,
                [
                    {
                        parameterName:
                            optionalParameterSpecification.parameterName,
                        parameterType:
                            optionalParameterSpecification.parameterType,
                        isOptional: optionalParameterSpecification.isOptional,
                    },
                ],
            );
        }
    }

    return node;
}

// parameter-specification-list:
//   required-parameter-specification-list
//   required-parameter-specification-list , optional-parameter-specification-list
//   optional-parameter-specification-list
export function parseParameterSpecificationList(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    // case: optional-parameter-specification-list
    if (node === null) {
        const optionalParameterSpecification =
            parseOptionalParameterSpecification(tokens, pointer);
        if (optionalParameterSpecification) {
            pointer = optionalParameterSpecification.stopIndex;
            let requiredParameterSpecificationList = [];
            let optionalParameterSpecificationList = [
                {
                    parameterName: optionalParameterSpecification.parameterName,
                    parameterType: optionalParameterSpecification.parameterType,
                    isOptional: optionalParameterSpecification.isOptional,
                },
            ];

            if (nextTokenIs(OperatorOrPunctuator.Comma, tokens, pointer)) {
                const remainingOptionalParameterSpecificationList =
                    parseOptionalParameterSpecificationList(
                        tokens,
                        pointer + 1,
                    );
                if (remainingOptionalParameterSpecificationList) {
                    pointer =
                        remainingOptionalParameterSpecificationList.stopIndex;
                    optionalParameterSpecificationList =
                        optionalParameterSpecificationList.concat(
                            remainingOptionalParameterSpecificationList.optionalParameterSpecificationList,
                        );
                }
            }

            node = new nodeClasses.ParameterSpecificationList(
                startIndex,
                pointer,
                requiredParameterSpecificationList,
                optionalParameterSpecificationList,
            );
        }
    }

    // case: required-parameter-specification-list
    // case: required-parameter-specification-list , optional-parameter-specification-list
    if (node === null) {
        const parameterSpecification = parseParameterSpecification(
            tokens,
            pointer,
        );
        if (parameterSpecification) {
            pointer = parameterSpecification.stopIndex;
            let requiredParameterSpecificationList = [
                {
                    parameterName: parameterSpecification.parameterName,
                    parameterType: parameterSpecification.parameterType,
                    isOptional: parameterSpecification.isOptional,
                },
            ];
            let optionalParameterSpecificationList = [];

            // recursive part
            if (nextTokenIs(OperatorOrPunctuator.Comma, tokens, pointer)) {
                const remainingParameterList = parseParameterSpecificationList(
                    tokens,
                    pointer + 1,
                );
                if (remainingParameterList) {
                    pointer = remainingParameterList.stopIndex;
                    requiredParameterSpecificationList =
                        requiredParameterSpecificationList.concat(
                            remainingParameterList.requiredParameterSpecificationList,
                        );
                    optionalParameterSpecificationList =
                        optionalParameterSpecificationList.concat(
                            remainingParameterList.optionalParameterSpecificationList,
                        );
                }
            }

            node = new nodeClasses.ParameterSpecificationList(
                startIndex,
                pointer,
                requiredParameterSpecificationList,
                optionalParameterSpecificationList,
            );
        }
    }

    return node;
}

// type-expression.primary-type.function-type
// function-type:
//   [function] ( parameter-specification-list(opt) ) return-type
export function parseFunctionType(tokens, startIndex) {
    let node = null;
    let requiredParameterSpecificationList = [];
    let optionalParameterSpecificationList = [];
    let pointer = startIndex;

    if (nextTokenValueIs("function", tokens, pointer)) {
        pointer += 1;

        if (
            nextTokenIs(
                OperatorOrPunctuator.OpeningParenthesis,
                tokens,
                pointer,
            )
        ) {
            pointer += 1;

            const parameterSpecificationListNode =
                parseParameterSpecificationList(tokens, pointer);
            if (parameterSpecificationListNode) {
                pointer = parameterSpecificationListNode.stopIndex;
                requiredParameterSpecificationList =
                    parameterSpecificationListNode.requiredParameterSpecificationList;
                optionalParameterSpecificationList =
                    parameterSpecificationListNode.optionalParameterSpecificationList;
            }

            if (
                nextTokenIs(
                    OperatorOrPunctuator.ClosingParenthesis,
                    tokens,
                    pointer,
                )
            ) {
                pointer += 1;

                const returnTypeNode = parsePrimitiveAssertion(tokens, pointer);
                if (returnTypeNode) {
                    pointer = returnTypeNode.stopIndex;
                    const returnType = {
                        nullableFlag: returnTypeNode.nullableFlag,
                        primitiveType: returnTypeNode.primitiveType,
                    };

                    node = new nodeClasses.FunctionType(
                        startIndex,
                        pointer,
                        requiredParameterSpecificationList,
                        optionalParameterSpecificationList,
                        returnType,
                    );
                }
            }
        }
    }

    return node;
}

// NULLABLE TYPE

// type-expression.primary-type.nullable-type
// nullable-type:
//   [nullable] type
export function parseNullableType(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenValueIs("nullable", tokens, pointer)) {
        pointer += 1;

        const nullableType = parseType(tokens, pointer);
        if (nullableType) {
            pointer = nullableType.stopIndex;

            node = new nodeClasses.NullableType(
                startIndex,
                pointer,
                nullableType,
            );
        }
    }

    return node;
}

// PRIMARY TYPE

// type-expression.primary-type
// primary-type:
//   primitive-type
//   record-type
//   list-type
//   function-type
//   table-type
//   nullable-type
export function parsePrimaryType(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    // table-type
    // table-type shall go before primitive-type because of the 'table' word can be evaluated to primitive-type
    if (node === null) {
        node = parseTableType(tokens, pointer);
    }

    // function-type
    if (node === null) {
        node = parseFunctionType(tokens, pointer);
    }

    // primitive-type
    if (node === null) {
        node = parsePrimitiveType(tokens, pointer);
    }

    // record-type
    if (node === null) {
        node = parseRecordType(tokens, pointer);
    }

    // list-type
    if (node === null) {
        node = parseListType(tokens, pointer);
    }

    // nullable-type
    if (node === null) {
        node = parseNullableType(tokens, pointer);
    }

    return node;
}

// TYPE

// type-expression.type
// type:
//   primary-expression
//   primary-type
export function parseType(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    // primary-type
    if (node === null) {
        node = parsePrimaryType(tokens, pointer);
    }

    // primary-expression
    if (node === null) {
        node = parsePrimaryExpression(tokens, pointer, null);
    }

    return node;
}

// TYPE EXPRESSION

// type-expression:
//   primary-expression
//   [type] primary-type
export function parseTypeExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    // type primary-type
    if (node === null) {
        if (nextTokenIs(Keyword.Type, tokens, pointer)) {
            node = parsePrimaryType(tokens, pointer + 1);
        }
    }

    // primary-expression
    if (node === null) {
        node = parsePrimaryExpression(tokens, pointer, null);
    }

    return node;
}

// ------------------------------------------
// UNARY EXPRESSION
// ------------------------------------------

// expression.logical-or-expression.logical-and-expression.is-expression.as-expression
//   .equality-expressionrelational-expression.additive-expression.multiplicative-expression
//   .metadata-expression.unary-expression

// unary-expression:
//   type-expression
//   + unary-expression
//   - unary-expression
//   [not] unary-expression
export function parseUnaryExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (node === null) {
        // + unary-expression
        // - unary-expression
        let operator = null;
        if (
            nextTokenIs(OperatorOrPunctuator.Plus, tokens, pointer) ||
            nextTokenIs(OperatorOrPunctuator.Minus, tokens, pointer)
        ) {
            const nextTokenValue = tokens[pointer].value;
            operator = operatorOrPuctuatorToTokenMapping[nextTokenValue];
        }
        // not unary-expression
        else if (nextTokenIs(Keyword.Not, tokens, pointer)) {
            operator = "not";
        }

        // operator and unary-expression
        if (operator) {
            const operand = parseUnaryExpression(tokens, pointer + 1);
            if (operand) {
                pointer = operand.stopIndex;

                node = new nodeClasses.UnaryExpression(
                    startIndex,
                    pointer,
                    operator,
                    operand,
                );
            }
        }
    }

    // type-expression
    if (node === null) {
        const typeExpression = parseTypeExpression(tokens, pointer);
        if (typeExpression) {
            pointer = typeExpression.stopIndex;
            node = typeExpression;
        }
    }

    return node;
}

// ------------------------------------------
// METADATA EXPRESSION
// ------------------------------------------

// expression.logical-or-expression.logical-and-expression.is-expression.as-expression
//   .equality-expressionrelational-expression.additive-expression.multiplicative-expression
//   .metadata-expression

// metadata-expression:
//   unary-expression
//   unary-expression [meta] unary-expression
export function parseMetadataExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    const expression = parseUnaryExpression(tokens, pointer);
    if (expression) {
        pointer = expression.stopIndex;

        // unary-expression [meta] unary-expression
        if (nextTokenValueIs("meta", tokens, pointer)) {
            const metaExpression = parseUnaryExpression(tokens, pointer + 1);
            if (metaExpression) {
                pointer = metaExpression.stopIndex;

                node = new nodeClasses.MetadataExpression(
                    startIndex,
                    pointer,
                    expression,
                    metaExpression,
                );
            }
        }
        // unary-expression
        else {
            node = expression;
        }
    }

    return node;
}

// ------------------------------------------
// MULTIPLICATIVE EXPRESSION
// ------------------------------------------

// expression.logical-or-expression.logical-and-expression.is-expression.as-expression
//   .equality-expressionrelational-expression.additive-expression.multiplicative-expression

// multiplicative-expression:
//   metadata-expression
//   metadata-expression * multiplicative-expression
//   metadata-expression / multiplicative-expression

export function parseMultiplicativeExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    const leftOperand = parseMetadataExpression(tokens, pointer);
    if (leftOperand) {
        pointer = leftOperand.stopIndex;

        // metadata-expression * multiplicative-expression
        // metadata-expression / multiplicative-expression
        if (
            nextTokenIs(OperatorOrPunctuator.Multiply, tokens, pointer) ||
            nextTokenIs(OperatorOrPunctuator.Divide, tokens, pointer)
        ) {
            const nextTokenValue = tokens[pointer].value;
            const operator = operatorOrPuctuatorToTokenMapping[nextTokenValue];
            pointer += 1;

            const rightOperand = parseMultiplicativeExpression(tokens, pointer);
            if (rightOperand) {
                pointer = rightOperand.stopIndex;

                node = new nodeClasses.MultiplicativeExpression(
                    startIndex,
                    pointer,
                    leftOperand,
                    operator,
                    rightOperand,
                );
            }
        }
        // metadata-expression
        else {
            node = leftOperand;
        }
    }

    return node;
}

// ------------------------------------------
// ADDITIVE EXPRESSION
// ------------------------------------------

// expression.logical-or-expression.logical-and-expression.is-expression.as-expression
//   .equality-expressionrelational-expression.additive-expression

// additive-expression:
//   multiplicative-expression
//   multiplicative-expression + additive-expression
//   multiplicative-expression - additive-expression
//   multiplicative-expression & additive-expression
export function parseAdditiveExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    const leftOperand = parseMultiplicativeExpression(tokens, pointer);
    if (leftOperand) {
        pointer = leftOperand.stopIndex;

        // multiplicative-expression + additive-expression
        // multiplicative-expression - additive-expression
        // multiplicative-expression & additive-expression
        if (
            nextTokenIs(OperatorOrPunctuator.Plus, tokens, pointer) ||
            nextTokenIs(OperatorOrPunctuator.Minus, tokens, pointer) ||
            nextTokenIs(OperatorOrPunctuator.Ampersand, tokens, pointer)
        ) {
            const nextTokenValue = tokens[pointer].value;
            const operator = operatorOrPuctuatorToTokenMapping[nextTokenValue];
            pointer += 1;

            const rightOperand = parseAdditiveExpression(tokens, pointer);
            if (rightOperand) {
                pointer = rightOperand.stopIndex;

                node = new nodeClasses.AdditiveExpression(
                    startIndex,
                    pointer,
                    leftOperand,
                    operator,
                    rightOperand,
                );
            }
        }
        // multiplicative-expression
        else {
            node = leftOperand;
        }
    }

    return node;
}

// ------------------------------------------
// RELATIONAL EXPRESSION
// ------------------------------------------

// expression.logical-or-expression.logical-and-expression.is-expression.as-expression
//   .equality-expression.relational-expression

// relational-expression:
//   additive-expression
//   additive-expression < relational-expression
//   additive-expression > relational-expression
//   additive-expression <= relational-expression
//   additive-expression >= relational-expression

export function parseRelationalExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    const leftOperand = parseAdditiveExpression(tokens, pointer);
    if (leftOperand) {
        pointer = leftOperand.stopIndex;

        // additive-expression < relational-expression
        // additive-expression > relational-expression
        // additive-expression <= relational-expression
        // additive-expression >= relational-expression
        if (
            nextTokenIs(OperatorOrPunctuator.LessThan, tokens, pointer) ||
            nextTokenIs(OperatorOrPunctuator.GreaterThan, tokens, pointer) ||
            nextTokenIs(
                OperatorOrPunctuator.LessThanOrEqual,
                tokens,
                pointer,
            ) ||
            nextTokenIs(
                OperatorOrPunctuator.GreaterThanOrEqual,
                tokens,
                pointer,
            )
        ) {
            const nextTokenValue = tokens[pointer].value;
            const operator = operatorOrPuctuatorToTokenMapping[nextTokenValue];
            pointer += 1;

            const rightOperand = parseRelationalExpression(tokens, pointer);
            if (rightOperand) {
                pointer = rightOperand.stopIndex;

                node = new nodeClasses.RelationalExpression(
                    startIndex,
                    pointer,
                    leftOperand,
                    operator,
                    rightOperand,
                );
            }
        }
        // additive-expression
        else {
            node = leftOperand;
        }
    }

    return node;
}

// ------------------------------------------
// EQUALITY EXPRESSION
// ------------------------------------------

// expression.logical-or-expression.logical-and-expression.is-expression.as-expression
//   .equality-expression.

// equality-expression:
//   relational-expression
//   relational-expression = equality-expression
//   relational-expression <> equality-expression

export function parseEqualityExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    const leftOperand = parseRelationalExpression(tokens, pointer);
    if (leftOperand) {
        pointer = leftOperand.stopIndex;

        // relational-expression = equality-expression
        // relational-expression <> equality-expression
        if (
            nextTokenIs(OperatorOrPunctuator.Equal, tokens, pointer) ||
            nextTokenIs(OperatorOrPunctuator.NotEqual, tokens, pointer)
        ) {
            const nextTokenValue = tokens[pointer].value;
            const operator = operatorOrPuctuatorToTokenMapping[nextTokenValue];
            pointer += 1;

            const rightOperand = parseEqualityExpression(tokens, pointer);
            if (rightOperand) {
                pointer = rightOperand.stopIndex;

                node = new nodeClasses.EqualityExpression(
                    startIndex,
                    pointer,
                    leftOperand,
                    operator,
                    rightOperand,
                );
            }
        }
        // relational-expression
        else {
            node = leftOperand;
        }
    }

    return node;
}

// ------------------------------------------
// AS EXPRESSION
// ------------------------------------------

// expression.logical-or-expression.logical-and-expression.is-expression.as-expression

// as-expression:
//   equality-expression
//   as-expression [as] nullable-primitive-type
export function parseAsExpression(
    tokens,
    startIndex,
    previousAsExpression = null,
) {
    let asExpression = null;
    let pointer = startIndex;

    // not entered recursion yet, first call
    if (previousAsExpression === null) {
        // equality-expression
        asExpression = parseEqualityExpression(tokens, pointer);
        if (asExpression) {
            pointer = asExpression.stopIndex;
        }
    }

    // this is part of a recursive call
    if (previousAsExpression !== null) {
        // nullable-primitive-type
        if (nextTokenIs(Keyword.As, tokens, pointer)) {
            const nullablePrimitiveType = parseNullablePrimitiveType(
                tokens,
                pointer + 1,
            );
            if (nullablePrimitiveType) {
                pointer = nullablePrimitiveType.stopIndex;

                asExpression = new nodeClasses.AsExpression(
                    startIndex,
                    pointer,
                    previousAsExpression,
                    {
                        nullableFlag: nullablePrimitiveType.nullableFlag,
                        primitiveType: nullablePrimitiveType.primitiveType,
                    },
                );
            }
        }
    }

    // start the recursion here
    if (asExpression) {
        const recursiveAsExpression = parseAsExpression(
            tokens,
            pointer,
            asExpression,
        );
        if (recursiveAsExpression) {
            asExpression = recursiveAsExpression;
        }
    }

    return asExpression;
}

// ------------------------------------------
// IS EXPRESSION
// ------------------------------------------

// expression.logical-or-expression.logical-and-expression.is-expression

// is-expression:
//   as-expression
//   is-expression [is] nullable-primitive-type
export function parseIsExpression(
    tokens,
    startIndex,
    previousIsExpression = null,
) {
    let isExpression = null;
    let pointer = startIndex;

    // not entered recursion yet, first call
    if (previousIsExpression === null) {
        isExpression = parseAsExpression(tokens, pointer, null);
        if (isExpression) {
            pointer = isExpression.stopIndex;
        }
    }

    // this is part of a recursive call
    if (previousIsExpression !== null) {
        // nullable-primitive-type
        if (nextTokenIs(Keyword.Is, tokens, pointer)) {
            const nullablePrimitiveType = parseNullablePrimitiveType(
                tokens,
                pointer + 1,
            );
            if (nullablePrimitiveType) {
                pointer = nullablePrimitiveType.stopIndex;

                isExpression = new nodeClasses.IsExpression(
                    startIndex,
                    pointer,
                    previousIsExpression,
                    {
                        nullableFlag: nullablePrimitiveType.nullableFlag,
                        primitiveType: nullablePrimitiveType.primitiveType,
                    },
                );
            }
        }
    }

    // start the recursion here
    if (isExpression) {
        const recursiveIsExpression = parseIsExpression(
            tokens,
            pointer,
            isExpression,
        );
        if (recursiveIsExpression) {
            isExpression = recursiveIsExpression;
        }
    }

    return isExpression;
}

// ------------------------------------------
// LOGICAL AND EXPRESSION
// ------------------------------------------

// expression.logical-or-expression.logical-and-expression

// logical-and-expression:
//   is-expression
//   logical-and-expression [and] is-expression
export function parseLogicalAndExpression(
    tokens,
    startIndex,
    previousLogicalAndExpression = null,
) {
    let logicalAndExpression = null;
    let pointer = startIndex;

    // not entered recursion yet, first call
    if (previousLogicalAndExpression === null) {
        logicalAndExpression = parseIsExpression(tokens, pointer, null);
        if (logicalAndExpression) {
            pointer = logicalAndExpression.stopIndex;
        }
    }

    // this is part of a recursive call
    if (previousLogicalAndExpression !== null) {
        if (nextTokenIs(Keyword.And, tokens, pointer)) {
            const rightOperand = parseIsExpression(tokens, pointer + 1, null);
            if (rightOperand) {
                pointer = rightOperand.stopIndex;

                logicalAndExpression = new nodeClasses.LogicalAndExpression(
                    startIndex,
                    pointer,
                    previousLogicalAndExpression,
                    rightOperand,
                );
            }
        }
    }

    // start the recursion here
    if (logicalAndExpression) {
        const recursiveLogicalAndExpression = parseLogicalAndExpression(
            tokens,
            pointer,
            logicalAndExpression,
        );
        if (recursiveLogicalAndExpression) {
            logicalAndExpression = recursiveLogicalAndExpression;
        }
    }

    return logicalAndExpression;
}

// ------------------------------------------
// LOGICAL OR EXPRESSION
// ------------------------------------------

// expression.logical-or-expression

// logical-or-expression:
//   logical-and-expression
//   logical-and-expression [or] logical-or-expression
export function parseLogicalOrExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    const leftOperand = parseLogicalAndExpression(tokens, pointer, null);
    if (leftOperand) {
        pointer = leftOperand.stopIndex;

        // logical-and-expression [or] logical-or-expression
        if (nextTokenIs(Keyword.Or, tokens, pointer)) {
            pointer += 1;

            const rightOperand = parseLogicalOrExpression(tokens, pointer);
            if (rightOperand) {
                pointer = rightOperand.stopIndex;

                node = new nodeClasses.LogicalOrExpression(
                    startIndex,
                    pointer,
                    leftOperand,
                    rightOperand,
                );
            }
        }
        // logical-and-expression
        else {
            node = leftOperand;
        }
    }

    return node;
}

// ------------------------------
// export function EXPRESSION
// ------------------------------

// expression.function-expression

// function-expression.parameter-list.fixed-parameter-list.parameter
// function-expression.parameter-list.optional-parameter-list.optional-parameter.parameter
// parameter:
//   parameter-name primitive-parameter-type(opt)
// primitive-parameter-type:
//   primitive-assertion
export function parseParameter(tokens, startIndex) {
    let node = null;
    let nullableFlag = null;
    let primitiveType = null;
    let pointer = startIndex;

    const parameterNameNode = parseParameterName(tokens, pointer);
    if (parameterNameNode) {
        pointer = parameterNameNode.stopIndex;

        const primitiveParameterType = parsePrimitiveAssertion(tokens, pointer);
        if (primitiveParameterType) {
            pointer = primitiveParameterType.stopIndex;
            nullableFlag = primitiveParameterType.nullableFlag;
            primitiveType = primitiveParameterType.primitiveType;
        }

        node = new nodeClasses.Parameter(
            startIndex,
            pointer,
            parameterNameNode.parameterName,
            nullableFlag,
            primitiveType,
            false,
        );
    }

    return node;
}

// function-expression.parameter-list.optional-parameter-list.optional-parameter
// optional-parameter:
//   [optional] parameter
export function parseOptionalParameter(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenValueIs("optional", tokens, pointer)) {
        pointer += 1;

        const parameter = parseParameter(tokens, pointer);
        if (parameter) {
            pointer = parameter.stopIndex;

            node = new nodeClasses.Parameter(
                startIndex,
                pointer,
                parameter.parameterName,
                parameter.nullableFlag,
                parameter.primitiveType,
                true,
            );
        }
    }

    return node;
}

// function-expression.parameter-list.optional-parameter-list
// optional-parameter-list:
//   optional-parameter
//   optional-parameter , optional-parameter-list
export function parseOptionalParameterList(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    const optionalParameter = parseOptionalParameter(tokens, pointer);
    if (optionalParameter) {
        pointer = optionalParameter.stopIndex;

        // recursive part
        if (nextTokenIs(OperatorOrPunctuator.Comma, tokens, pointer)) {
            const remainingOtionalParameterList = parseOptionalParameterList(
                tokens,
                pointer + 1,
            );
            if (remainingOtionalParameterList) {
                pointer = remainingOtionalParameterList.stopIndex;

                node = new nodeClasses.OptionalParameterList(
                    startIndex,
                    pointer,
                    [
                        {
                            parameterName: optionalParameter.parameterName,
                            nullableFlag: optionalParameter.nullableFlag,
                            primitiveType: optionalParameter.primitiveType,
                            isOptional: optionalParameter.isOptional,
                        },
                    ].concat(
                        remainingOtionalParameterList.optionalParameterList,
                    ),
                );
            }
        }
        // else end parsing list
        else {
            node = new nodeClasses.OptionalParameterList(startIndex, pointer, [
                {
                    parameterName: optionalParameter.parameterName,
                    nullableFlag: optionalParameter.nullableFlag,
                    primitiveType: optionalParameter.primitiveType,
                    isOptional: optionalParameter.isOptional,
                },
            ]);
        }
    }

    return node;
}

// function-expression.parameter-list
// parameter-list:
//   fixed-parameter-list
//   fixed-parameter-list , optional-parameter-list
//   optional-parameter-list
export function parseParameterList(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    // optional-parameter
    if (node === null) {
        const optionalParameter = parseOptionalParameter(tokens, pointer);
        if (optionalParameter) {
            pointer = optionalParameter.stopIndex;
            let fixedParameterList = [];
            let optionalParameterList = [
                {
                    parameterName: optionalParameter.parameterName,
                    nullableFlag: optionalParameter.nullableFlag,
                    primitiveType: optionalParameter.primitiveType,
                    isOptional: optionalParameter.isOptional,
                },
            ];

            if (nextTokenIs(OperatorOrPunctuator.Comma, tokens, pointer)) {
                const remainingOptionalParameterList =
                    parseOptionalParameterList(tokens, pointer + 1);
                if (remainingOptionalParameterList) {
                    pointer = remainingOptionalParameterList.stopIndex;
                    optionalParameterList = optionalParameterList.concat(
                        remainingOptionalParameterList.optionalParameterList,
                    );
                }
            }

            node = new nodeClasses.ParameterList(
                startIndex,
                pointer,
                fixedParameterList,
                optionalParameterList,
            );
        }
    }

    // fixed-parameter-list
    // fixed-parameter-list , optional-parameter-list
    if (node === null) {
        const parameter = parseParameter(tokens, pointer);
        if (parameter) {
            pointer = parameter.stopIndex;
            let fixedParameterList = [
                {
                    parameterName: parameter.parameterName,
                    nullableFlag: parameter.nullableFlag,
                    primitiveType: parameter.primitiveType,
                    isOptional: parameter.isOptional,
                },
            ];
            let optionalParameterList = [];

            // recursive part
            if (nextTokenIs(OperatorOrPunctuator.Comma, tokens, pointer)) {
                const remainingParameterList = parseParameterList(
                    tokens,
                    pointer + 1,
                );
                if (remainingParameterList) {
                    pointer = remainingParameterList.stopIndex;
                    fixedParameterList = fixedParameterList.concat(
                        remainingParameterList.fixedParameterList,
                    );
                    optionalParameterList = optionalParameterList.concat(
                        remainingParameterList.optionalParameterList,
                    );
                }
            }

            node = new nodeClasses.ParameterList(
                startIndex,
                pointer,
                fixedParameterList,
                optionalParameterList,
            );
        }
    }

    return node;
}

// expression.function-expression
// function-expression:
// ( parameter-list(opt) ) return-type(opt) => function-body

export function parseFunctionExpression(tokens, startIndex) {
    let node = null;
    let fixedParameterList = [];
    let optionalParameterList = [];
    let returnType = null;
    let pointer = startIndex;

    if (nextTokenIs(OperatorOrPunctuator.OpeningParenthesis, tokens, pointer)) {
        pointer += 1;

        const parameterListNode = parseParameterList(tokens, pointer);
        if (parameterListNode) {
            pointer = parameterListNode.stopIndex;
            fixedParameterList = parameterListNode.fixedParameterList;
            optionalParameterList = parameterListNode.optionalParameterList;
        }

        if (
            nextTokenIs(
                OperatorOrPunctuator.ClosingParenthesis,
                tokens,
                pointer,
            )
        ) {
            pointer += 1;

            const returnTypeNode = parsePrimitiveAssertion(tokens, pointer);
            if (returnTypeNode) {
                pointer = returnTypeNode.stopIndex;
                returnType = {
                    nullableFlag: returnTypeNode.nullableFlag,
                    primitiveType: returnTypeNode.primitiveType,
                };
            }

            if (nextTokenIs(OperatorOrPunctuator.Arrow, tokens, pointer)) {
                pointer += 1;

                const functionBody = parseExpression(tokens, pointer);
                if (functionBody) {
                    pointer = functionBody.stopIndex;

                    node = new nodeClasses.FunctionExpression(
                        startIndex,
                        pointer,
                        fixedParameterList,
                        optionalParameterList,
                        returnType,
                        functionBody,
                    );
                }
            }
        }
    }

    return node;
}

// ------------------------------
// ERROR HANDLING EXPRESSION
// ------------------------------

// expression.error-handling-expression.error-handler.otherwise-clause
// otherwise-clause:
//   [otherwise] default-expression
export function parseOtherwiseClause(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenIs(Keyword.Otherwise, tokens, pointer)) {
        pointer += 1;

        const defaultExpression = parseExpression(tokens, pointer);
        if (defaultExpression) {
            pointer = defaultExpression.stopIndex;

            node = new nodeClasses.OtherwiseClause(
                startIndex,
                pointer,
                defaultExpression,
            );
        }
    }

    return node;
}

// expression.error-handling-expression.error-handler.catch-clause
// catch-clause:
//   [catch] (parameter-name(opt)) => function-body

export function parseCatchClause(tokens, startIndex) {
    let node = null;
    let parameterName = null;
    let pointer = startIndex;

    if (nextTokenValueIs("catch", tokens, pointer)) {
        pointer += 1;

        if (
            nextTokenIs(
                OperatorOrPunctuator.OpeningParenthesis,
                tokens,
                pointer,
            )
        ) {
            pointer += 1;

            const parameterNameNode = parseParameterName(tokens, pointer);
            if (parameterNameNode) {
                pointer = parameterNameNode.stopIndex;
                parameterName = parameterNameNode.parameterName;
            }

            if (
                nextTokenIs(
                    OperatorOrPunctuator.ClosingParenthesis,
                    tokens,
                    pointer,
                )
            ) {
                pointer += 1;

                if (nextTokenIs(OperatorOrPunctuator.Arrow, tokens, pointer)) {
                    pointer += 1;

                    const functionBody = parseExpression(tokens, pointer);
                    if (functionBody) {
                        pointer = functionBody.stopIndex;

                        node = new nodeClasses.CatchClause(
                            startIndex,
                            pointer,
                            parameterName,
                            functionBody,
                        );
                    }
                }
            }
        }
    }

    return node;
}

// expression.error-handling-expression.error-handler
// error-handler:
//   otherwise-clause
//   catch-clause

export function parseErrorHandler(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    // otherwise-clause
    if (node === null) {
        const otherwiseClauseNode = parseOtherwiseClause(tokens, pointer);
        if (otherwiseClauseNode) {
            pointer = otherwiseClauseNode.stopIndex;

            node = new nodeClasses.ErrorHandler(
                startIndex,
                pointer,
                {
                    defaultExpression: otherwiseClauseNode.defaultExpression,
                },
                null,
            );
        }
    }

    // catch-clause
    if (node === null) {
        const catchClause = parseCatchClause(tokens, pointer);
        if (catchClause) {
            pointer = catchClause.stopIndex;

            node = new nodeClasses.ErrorHandler(startIndex, pointer, null, {
                parameterName: catchClause.parameterName,
                functionBody: catchClause.functionBody,
            });
        }
    }

    return node;
}

// expression.error-handling-expression
// error-handling-expression:
//   [try] protected-expression error-handler(opt)
export function parseErrorHandlingExpression(tokens, startIndex) {
    let node = null;
    let otherwiseClause = null;
    let catchClause = null;
    let pointer = startIndex;

    if (nextTokenIs(Keyword.Try, tokens, pointer)) {
        pointer += 1;

        const protectedExpression = parseExpression(tokens, pointer);
        if (protectedExpression) {
            pointer = protectedExpression.stopIndex;

            const errorHandler = parseErrorHandler(tokens, pointer);
            if (errorHandler) {
                pointer = errorHandler.stopIndex;
                otherwiseClause = errorHandler.otherwiseClause;
                catchClause = errorHandler.catchClause;
            }

            node = new nodeClasses.ErrorHandlingExpression(
                startIndex,
                pointer,
                protectedExpression,
                otherwiseClause,
                catchClause,
            );
        }
    }

    return node;
}

// ------------------------------
// ERROR RAISING EXPRESSION
// ------------------------------

// expression.error-raising-expression
// error-raising-expression:
//   [error] expression

export function parseErrorRaisingExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenIs(Keyword.Error, tokens, pointer)) {
        pointer += 1;

        const expression = parseExpression(tokens, pointer);
        if (expression) {
            pointer = expression.stopIndex;

            node = new nodeClasses.ErrorRaisingExpression(
                startIndex,
                pointer,
                expression,
            );
        }
    }

    return node;
}

// ------------------------------
// IF EXPRESSION
// ------------------------------

// expression.if-expression
// if-expression:
//   [if] if-condition [then] true-expression [else] false-expression
export function parseIfExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenIs(Keyword.If, tokens, pointer)) {
        pointer += 1;

        const ifCondition = parseExpression(tokens, pointer);
        if (ifCondition) {
            pointer = ifCondition.stopIndex;

            if (nextTokenIs(Keyword.Then, tokens, pointer)) {
                pointer += 1;

                const trueExpression = parseExpression(tokens, pointer);
                if (trueExpression) {
                    pointer = trueExpression.stopIndex;

                    if (nextTokenIs(Keyword.Else, tokens, pointer)) {
                        pointer += 1;

                        const falseExpression = parseExpression(
                            tokens,
                            pointer,
                        );
                        if (falseExpression) {
                            pointer = falseExpression.stopIndex;

                            node = new nodeClasses.IfExpression(
                                startIndex,
                                pointer,
                                ifCondition,
                                trueExpression,
                                falseExpression,
                            );
                        }
                    }
                }
            }
        }
    }

    return node;
}

// ------------------------------
// EACH EXPRESSION
// ------------------------------

// expression.each-expression
// each-expression:
//   [each] each-expression-body
export function parseEachExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenIs(Keyword.Each, tokens, pointer)) {
        pointer += 1;

        const expression = parseExpression(tokens, pointer);
        if (expression) {
            pointer = expression.stopIndex;

            node = new nodeClasses.EachExpression(
                startIndex,
                pointer,
                expression,
            );
        }
    }

    return node;
}

// ------------------------------
// LET EXPRESSION
// ------------------------------

// expression.let-expression.variable-list.variable.variable-name
// variable-name:
//   identifier
export function parseVariableName(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (
        nextTokenIs(Identifier.Regular, tokens, pointer) ||
        nextTokenIs(Identifier.Quoted, tokens, pointer)
    ) {
        const variableName = tokens[pointer].value;
        pointer += 1;

        node = new nodeClasses.VariableName(startIndex, pointer, variableName);
    }

    return node;
}

// expression.let-expression.variable-list.variable
// variable:
//   variable-name = expression
export function parseVariable(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    const variableNameNode = parseVariableName(tokens, pointer);
    if (variableNameNode) {
        pointer = variableNameNode.stopIndex;

        if (nextTokenIs(OperatorOrPunctuator.Equal, tokens, pointer)) {
            pointer += 1;

            const expression = parseExpression(tokens, pointer);
            if (expression) {
                pointer = expression.stopIndex;

                node = new nodeClasses.Variable(
                    startIndex,
                    pointer,
                    variableNameNode.variableName,
                    expression,
                );
            }
        }
    }

    return node;
}

// expression.let-expression.variable-list
// variable-list:
//   variable
//   variable , variable-list
export function parseVariableList(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    const variable = parseVariable(tokens, pointer);
    if (variable) {
        pointer = variable.stopIndex;

        // recursive part
        if (nextTokenIs(OperatorOrPunctuator.Comma, tokens, pointer)) {
            const remainingVariableList = parseVariableList(
                tokens,
                pointer + 1,
            );
            if (remainingVariableList) {
                pointer = remainingVariableList.stopIndex;

                node = new nodeClasses.VariableList(
                    startIndex,
                    pointer,
                    [
                        {
                            variableName: variable.variableName,
                            expression: variable.expression,
                        },
                    ].concat(remainingVariableList.variableList),
                );
            }
        }
        // else end parsing list
        else {
            node = new nodeClasses.VariableList(startIndex, pointer, [
                {
                    variableName: variable.variableName,
                    expression: variable.expression,
                },
            ]);
        }
    }

    return node;
}

// expression.let-expression
// let-expression:
//   [let] variable-list [in] expression
export function parseLetExpression(tokens, startIndex) {
    let node = null;
    let pointer = startIndex;

    if (nextTokenIs(Keyword.Let, tokens, pointer)) {
        pointer += 1;

        const variableListNode = parseVariableList(tokens, pointer);
        if (variableListNode) {
            pointer = variableListNode.stopIndex;

            if (nextTokenIs(Keyword.In, tokens, pointer)) {
                pointer += 1;

                const outputExpression = parseExpression(tokens, pointer);
                if (outputExpression) {
                    pointer = outputExpression.stopIndex;

                    node = new nodeClasses.LetExpression(
                        startIndex,
                        pointer,
                        variableListNode.variableList,
                        outputExpression,
                    );
                }
            }
        }
    }

    return node;
}

// ------------------------------
// EXPRESSION
// ------------------------------

// expression-document.expression
// expression:
//   logical-or-expression
//   each-expression
//   function-expression
//   let-expression
//   if-expression
//   error-raising-expression
//   error-handling-expression

export function parseExpression(tokens, startIndex) {
    let expression = null;
    let pointer = startIndex;

    // let-expression
    if (expression === null) {
        expression = parseLetExpression(tokens, pointer);
        if (expression) {
            pointer = expression.stopIndex;
        }
    }

    // each-expression
    if (expression === null) {
        expression = parseEachExpression(tokens, pointer);
        if (expression) {
            pointer = expression.stopIndex;
        }
    }

    // if-expression
    if (expression === null) {
        expression = parseIfExpression(tokens, pointer);
        if (expression) {
            pointer = expression.stopIndex;
        }
    }

    // function-expression
    if (expression === null) {
        expression = parseFunctionExpression(tokens, pointer);
        if (expression) {
            pointer = expression.stopIndex;
        }
    }

    // error-raising-expression
    if (expression === null) {
        expression = parseErrorRaisingExpression(tokens, pointer);
        if (expression) {
            pointer = expression.stopIndex;
        }
    }

    // error-handling-expression
    if (expression === null) {
        expression = parseErrorHandlingExpression(tokens, pointer);
        if (expression) {
            pointer = expression.stopIndex;
        }
    }

    // logical-or-expression
    if (expression === null) {
        expression = parseLogicalOrExpression(tokens, pointer);
        if (expression) {
            pointer = expression.stopIndex;
        }
    }

    return expression;
}
