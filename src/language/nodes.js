const NodeType = {
    NotImplementedExpression: "not-implemented-expression",
    SectionAccessExpression: "section-access-expression",
    IdentifierExpression: "identifier-expression",
    LiteralExpression: "literal-expression",

    ArgumentList: "argument-list",
    InvokeExpressionArgumentList: "invoke-expression-argument-list",
    InvokeExpression: "invoke-expression",

    Item: "item",
    ItemList: "item-list",
    ListExpression: "list-expression",

    FieldName: "field-name",
    Field: "field",
    FieldList: "field-list",
    RecordExpression: "record-expression",

    ItemAccessExpressionItemSelector: "item-access-expression-item-selector",
    ItemAccessExpression: "item-access-expression",

    RequiredFieldSelector: "required-field-selector",
    ImplicitTargetFieldSelection: "implicit-target-field-selection",
    RequiredSelectorList: "required-selector-list",
    RequiredProjection: "required-projection",
    ImplicitTargetProjection: "implicit-target-projection",
    FieldAccessExpression: "field-access-expression",

    PrimitiveType: "primitive-type",
    ListType: "list-type",
    OpenRecordMarker: "open-record-marker",
    FieldTypeSpecification: "field-type-specification",
    FieldSpecification: "field-specification",
    FieldSpecificationList: "field-specification-list",
    RecordType: "record-type",
    TableType: "table-type",
    NullableType: "nullable-type",

    ParameterName: "parameter-name",
    NullablePrimitiveType: "nullable-primitive-type",
    PrimitiveAssertion: "primitive-assertion",
    Assertion: "assertion",
    ParameterSpecification: "parameter-specification",
    RequiredParameterSpecificationList: "required-parameter-specification-list",
    OptionalParameterSpecificationList: "optional-parameter-specification-list",
    ParameterSpecificationList: "parameter-specification-list",
    FunctionType: "function-type",

    UnaryExpression: "unary-expression",
    MetadataExpression: "metadata-expression",
    MultiplicativeExpression: "multiplicative-expression",
    AdditiveExpression: "additive-expression",
    RelationalExpression: "relational-expression",
    EqualityExpression: "equality-expression",
    AsExpression: "as-expression",
    IsExpression: "is-expression",
    LogicalAndExpression: "logical-and-expression",
    LogicalOrExpression: "logical-or-expression",

    Parameter: "parameter",
    OptionalParameterList: "optional-parameter-list",
    ParameterList: "parameter-list",
    FunctionExpression: "function-expression",

    OtherwiseClause: "otherwise-clause",
    CatchClause: "catch-clause",
    ErrorHandler: "error-handler",
    ErrorHandlingExpression: "error-handling-expression",

    ErrorRaisingExpression: "error-raising-expression",
    IfExpression: "if-expression",
    EachExpression: "each-expression",

    VariableName: "variable-name",
    Variable: "variable",
    VariableList: "variable-list",
    LetExpression: "let-expression",
};

// DEFINE NODE TYPES

export class Node {
    constructor(type, startIndex, stopIndex) {
        this.type = type;
        this.id = `${type}-${startIndex}`;
        this.startIndex = startIndex;
        this.stopIndex = stopIndex;
    }
}

// ------------------------------------------
// PRIMARY-EXPRESSION
// ------------------------------------------

// NOT-IMPLEMENTED-EXPRESSION

export class NotImplementedExpression extends Node {
    constructor(startIndex, stopIndex) {
        super(NodeType.NotImplementedExpression, startIndex, stopIndex);
    }
}

// SECTION-ACCESS-EXPRESSION

export class SectionAccessExpression extends Node {
    constructor(
        startIndex,
        stopIndex,
        firstIdentifierName,
        secondIdentifierName,
    ) {
        super(NodeType.SectionAccessExpression, startIndex, stopIndex);
        this.firstIdentifierName = firstIdentifierName;
        this.secondIdentifierName = secondIdentifierName;
    }
}

// IDENTIFIER-EXPRESSION

export class IdentifierExpression extends Node {
    constructor(startIndex, stopIndex, identifierName, isInclusive) {
        super(NodeType.IdentifierExpression, startIndex, stopIndex);
        this.identifierName = identifierName;
        this.isInclusive = isInclusive;
    }
}

// LITERAL-EXPRESSION

export class LiteralExpression extends Node {
    constructor(startIndex, stopIndex, literalValue, literalType) {
        super(NodeType.LiteralExpression, startIndex, stopIndex);
        this.literalValue = literalValue;
        this.literalType = literalType;
    }
}

// INVOKE-EXPRESSION

export class ArgumentList extends Node {
    constructor(startIndex, stopIndex, argumentList) {
        super(NodeType.ArgumentList, startIndex, stopIndex);
        this.argumentList = argumentList;
    }
}

export class InvokeExpressionArgumentList extends Node {
    constructor(startIndex, stopIndex, argumentList) {
        super(NodeType.InvokeExpressionArgumentList, startIndex, stopIndex);
        this.argumentList = argumentList;
    }
}

export class InvokeExpression extends Node {
    constructor(startIndex, stopIndex, invokedPrimaryExpression, argumentList) {
        super(NodeType.InvokeExpression, startIndex, stopIndex);
        this.invokedPrimaryExpression = invokedPrimaryExpression;
        this.argumentList = argumentList;
    }
}

// LIST-EXPRESSION

export class Item extends Node {
    constructor(
        startIndex,
        stopIndex,
        expression,
        isSequenceItem,
        secondExpression,
    ) {
        super(NodeType.Item, startIndex, stopIndex);
        this.expression = expression;
        this.isSequenceItem = isSequenceItem;
        this.secondExpression = secondExpression;
    }
}

export class ItemList extends Node {
    constructor(startIndex, stopIndex, itemList) {
        super(NodeType.ItemList, startIndex, stopIndex);
        this.itemList = itemList;
    }
}

export class ListExpression extends Node {
    constructor(startIndex, stopIndex, itemList) {
        super(NodeType.ListExpression, startIndex, stopIndex);
        this.itemList = itemList;
    }
}

// RECORD EXPRESSION

export class FieldName extends Node {
    constructor(startIndex, stopIndex, fieldName) {
        super(NodeType.FieldName, startIndex, stopIndex);
        this.fieldName = fieldName;
    }
}

export class Field extends Node {
    constructor(startIndex, stopIndex, fieldName, expression) {
        super(NodeType.Field, startIndex, stopIndex);
        this.fieldName = fieldName;
        this.expression = expression;
    }
}

export class FieldList extends Node {
    constructor(startIndex, stopIndex, fieldList) {
        super(NodeType.FieldList, startIndex, stopIndex);
        this.fieldList = fieldList;
    }
}

export class RecordExpression extends Node {
    constructor(startIndex, stopIndex, fieldList) {
        super(NodeType.RecordExpression, startIndex, stopIndex);
        this.fieldList = fieldList;
    }
}

// ITEM ACCESS EXPRESSION

export class ItemAccessExpressionItemSelector extends Node {
    constructor(startIndex, stopIndex, itemSelector, isOptionalSelection) {
        super(NodeType.ItemAccessExpressionItemSelector, startIndex, stopIndex);
        this.itemSelector = itemSelector;
        this.isOptionalSelection = isOptionalSelection;
    }
}

export class ItemAccessExpression extends Node {
    constructor(
        startIndex,
        stopIndex,
        selectedPrimaryExpression,
        itemSelector,
        isOptionalSelection,
    ) {
        super(NodeType.ItemAccessExpression, startIndex, stopIndex);
        this.selectedPrimaryExpression = selectedPrimaryExpression;
        this.itemSelector = itemSelector;
        this.isOptionalSelection = isOptionalSelection;
    }
}

// FIELD ACCESS EXPRESSION

export class RequiredFieldSelector extends Node {
    constructor(startIndex, stopIndex, fieldName) {
        super(NodeType.RequiredFieldSelector, startIndex, stopIndex);
        this.fieldName = fieldName;
    }
}

export class ImplicitTargetFieldSelection extends Node {
    constructor(startIndex, stopIndex, fieldName, isOptionalSelection) {
        super(NodeType.ImplicitTargetFieldSelection, startIndex, stopIndex);
        this.fieldName = fieldName;
        this.isOptionalSelection = isOptionalSelection;
    }
}

export class RequiredSelectorList extends Node {
    constructor(startIndex, stopIndex, requiredSelectorList) {
        super(NodeType.RequiredSelectorList, startIndex, stopIndex);
        this.requiredSelectorList = requiredSelectorList;
    }
}

export class RequiredProjection extends Node {
    constructor(startIndex, stopIndex, requiredSelectorList) {
        super(NodeType.RequiredProjection, startIndex, stopIndex);
        this.requiredSelectorList = requiredSelectorList;
    }
}

export class ImplicitTargetProjection extends Node {
    constructor(
        startIndex,
        stopIndex,
        requiredSelectorList,
        isOptionalSelection,
    ) {
        super(NodeType.ImplicitTargetProjection, startIndex, stopIndex);
        this.requiredSelectorList = requiredSelectorList;
        this.isOptionalSelection = isOptionalSelection;
    }
}

export class FieldAccessExpression extends Node {
    constructor(
        startIndex,
        stopIndex,
        selectedPrimaryExpression,
        implicitTargetFieldSelection,
        implicitTargetProjection,
        isOptionalSelection,
    ) {
        super(NodeType.FieldAccessExpression, startIndex, stopIndex);
        this.selectedPrimaryExpression = selectedPrimaryExpression;
        this.implicitTargetFieldSelection = implicitTargetFieldSelection;
        this.implicitTargetProjection = implicitTargetProjection;
        this.isOptionalSelection = isOptionalSelection;
    }
}

// ------------------------------------------
// TYPE EXPRESSION
// ------------------------------------------

//  PRIMITIVE TYPE

export class PrimitiveType extends Node {
    constructor(startIndex, stopIndex, primitiveType) {
        super(NodeType.PrimitiveType, startIndex, stopIndex);
        this.primitiveType = primitiveType;
    }
}

// LIST TYPE

export class ListType extends Node {
    constructor(startIndex, stopIndex, itemType) {
        super(NodeType.ListType, startIndex, stopIndex);
        this.itemType = itemType;
    }
}

// RECORD-TYPE

export class OpenRecordMarker extends Node {
    constructor(startIndex, stopIndex) {
        super(NodeType.OpenRecordMarker, startIndex, stopIndex);
    }
}

export class FieldTypeSpecification extends Node {
    constructor(startIndex, stopIndex, fieldType) {
        super(NodeType.FieldTypeSpecification, startIndex, stopIndex);
        this.fieldType = fieldType;
    }
}

export class FieldSpecification extends Node {
    constructor(startIndex, stopIndex, fieldName, fieldType, isOptional) {
        super(NodeType.FieldSpecification, startIndex, stopIndex);
        this.fieldName = fieldName;
        this.fieldType = fieldType;
        this.isOptional = isOptional;
    }
}

export class FieldSpecificationList extends Node {
    constructor(startIndex, stopIndex, fieldSpecificationList) {
        super(NodeType.FieldSpecificationList, startIndex, stopIndex);
        this.fieldSpecificationList = fieldSpecificationList;
    }
}

export class RecordType extends Node {
    constructor(
        startIndex,
        stopIndex,
        hasOpenRecordMarker,
        fieldSpecificationList,
    ) {
        super(NodeType.RecordType, startIndex, stopIndex);
        this.hasOpenRecordMarker = hasOpenRecordMarker;
        this.fieldSpecificationList = fieldSpecificationList;
    }
}

// TABLE TYPE

export class TableType extends Node {
    constructor(startIndex, stopIndex, fieldSpecificationList) {
        super(NodeType.TableType, startIndex, stopIndex);
        this.fieldSpecificationList = fieldSpecificationList;
    }
}

// FUNCTION TYPE

export class ParameterName extends Node {
    constructor(startIndex, stopIndex, parameterName) {
        super(NodeType.ParameterName, startIndex, stopIndex);
        this.parameterName = parameterName;
    }
}

export class NullablePrimitiveType extends Node {
    constructor(startIndex, stopIndex, nullableFlag, primitiveType) {
        super(NodeType.NullablePrimitiveType, startIndex, stopIndex);
        this.nullableFlag = nullableFlag;
        this.primitiveType = primitiveType;
    }
}

export class PrimitiveAssertion extends Node {
    constructor(startIndex, stopIndex, nullableFlag, primitiveType) {
        super(NodeType.PrimitiveAssertion, startIndex, stopIndex);
        this.nullableFlag = nullableFlag;
        this.primitiveType = primitiveType;
    }
}

export class Assertion extends Node {
    constructor(startIndex, stopIndex, typeNode) {
        super(NodeType.Assertion, startIndex, stopIndex);
        this.typeNode = typeNode;
    }
}

export class ParameterSpecification extends Node {
    constructor(
        startIndex,
        stopIndex,
        parameterName,
        parameterType,
        isOptional,
    ) {
        super(NodeType.ParameterSpecification, startIndex, stopIndex);
        this.parameterName = parameterName;
        this.parameterType = parameterType;
        this.isOptional = isOptional;
    }
}

export class OptionalParameterSpecificationList extends Node {
    constructor(startIndex, stopIndex, optionalParameterSpecificationList) {
        super(
            NodeType.OptionalParameterSpecificationList,
            startIndex,
            stopIndex,
        );
        this.optionalParameterSpecificationList =
            optionalParameterSpecificationList;
    }
}

export class ParameterSpecificationList extends Node {
    constructor(
        startIndex,
        stopIndex,
        requiredParameterSpecificationList,
        optionalParameterSpecificationList,
    ) {
        super(NodeType.ParameterSpecificationList, startIndex, stopIndex);
        this.requiredParameterSpecificationList =
            requiredParameterSpecificationList;
        this.optionalParameterSpecificationList =
            optionalParameterSpecificationList;
        this.parameterSpecificationList =
            requiredParameterSpecificationList.concat(
                optionalParameterSpecificationList,
            );
    }
}

export class FunctionType extends Node {
    constructor(
        startIndex,
        stopIndex,
        requiredParameterSpecificationList,
        optionalParameterSpecificationList,
        returnType,
    ) {
        super(NodeType.FunctionType, startIndex, stopIndex);
        this.requiredParameterSpecificationList =
            requiredParameterSpecificationList;
        this.optionalParameterSpecificationList =
            optionalParameterSpecificationList;
        this.parameterSpecificationList =
            requiredParameterSpecificationList.concat(
                optionalParameterSpecificationList,
            );
        this.returnType = returnType;
    }
}

// NULLABLE TYPE

export class NullableType extends Node {
    constructor(startIndex, stopIndex, nullableType) {
        super(NodeType.NullableType, startIndex, stopIndex);
        this.nullableType = nullableType;
    }
}

// ------------------------------------------
// UNARY EXPRESSION
// ------------------------------------------

export class UnaryExpression extends Node {
    constructor(startIndex, stopIndex, operator, operand) {
        super(NodeType.UnaryExpression, startIndex, stopIndex);
        this.operator = operator;
        this.operand = operand;
    }
}

// ------------------------------------------
// METADATA EXPRESSION
// ------------------------------------------

export class MetadataExpression extends Node {
    constructor(startIndex, stopIndex, expression, metaExpression) {
        super(NodeType.MetadataExpression, startIndex, stopIndex);
        this.expression = expression;
        this.metaExpression = metaExpression;
    }
}

// ------------------------------------------
// MULTIPLICATIVE EXPRESSION
// ------------------------------------------

export class MultiplicativeExpression extends Node {
    constructor(startIndex, stopIndex, leftOperand, operator, rightOperand) {
        super(NodeType.MultiplicativeExpression, startIndex, stopIndex);
        this.leftOperand = leftOperand;
        this.operator = operator;
        this.rightOperand = rightOperand;
    }
}

// ------------------------------------------
// ADDITIVE EXPRESSION
// ------------------------------------------

export class AdditiveExpression extends Node {
    constructor(startIndex, stopIndex, leftOperand, operator, rightOperand) {
        super(NodeType.AdditiveExpression, startIndex, stopIndex);
        this.leftOperand = leftOperand;
        this.operator = operator;
        this.rightOperand = rightOperand;
    }
}

// ------------------------------------------
// RELATIONAL EXPRESSION
// ------------------------------------------

export class RelationalExpression extends Node {
    constructor(startIndex, stopIndex, leftOperand, operator, rightOperand) {
        super(NodeType.RelationalExpression, startIndex, stopIndex);
        this.leftOperand = leftOperand;
        this.operator = operator;
        this.rightOperand = rightOperand;
    }
}

// ------------------------------------------
// EQUALITY EXPRESSION
// ------------------------------------------

export class EqualityExpression extends Node {
    constructor(startIndex, stopIndex, leftOperand, operator, rightOperand) {
        super(NodeType.EqualityExpression, startIndex, stopIndex);
        this.leftOperand = leftOperand;
        this.operator = operator;
        this.rightOperand = rightOperand;
    }
}

// ------------------------------------------
// AS EXPRESSION
// ------------------------------------------

export class AsExpression extends Node {
    constructor(startIndex, stopIndex, sourceExpression, targetType) {
        super(NodeType.AsExpression, startIndex, stopIndex);
        this.sourceExpression = sourceExpression;
        this.targetType = targetType;
    }
}

// ------------------------------------------
// IS EXPRESSION
// ------------------------------------------

export class IsExpression extends Node {
    constructor(startIndex, stopIndex, sourceExpression, targetType) {
        super(NodeType.IsExpression, startIndex, stopIndex);
        this.sourceExpression = sourceExpression;
        this.targetType = targetType;
    }
}

// ------------------------------------------
// LOGICAL AND EXPRESSION
// ------------------------------------------

export class LogicalAndExpression extends Node {
    constructor(startIndex, stopIndex, leftOperand, rightOperand) {
        super(NodeType.LogicalAndExpression, startIndex, stopIndex);
        this.leftOperand = leftOperand;
        this.rightOperand = rightOperand;
    }
}

// ------------------------------------------
// LOGICAL OR EXPRESSION
// ------------------------------------------

export class LogicalOrExpression extends Node {
    constructor(startIndex, stopIndex, leftOperand, rightOperand) {
        super(NodeType.LogicalOrExpression, startIndex, stopIndex);
        this.leftOperand = leftOperand;
        this.rightOperand = rightOperand;
    }
}

// ------------------------------
// FUNCTION EXPRESSION
// ------------------------------

export class Parameter extends Node {
    constructor(
        startIndex,
        stopIndex,
        parameterName,
        nullableFlag,
        primitiveType,
        isOptional,
    ) {
        super(NodeType.Parameter, startIndex, stopIndex);
        this.parameterName = parameterName;
        this.nullableFlag = nullableFlag;
        this.primitiveType = primitiveType;
        this.isOptional = isOptional;
    }
}

export class OptionalParameterList extends Node {
    constructor(startIndex, stopIndex, optionalParameterList) {
        super(NodeType.OptionalParameterList, startIndex, stopIndex);
        this.optionalParameterList = optionalParameterList;
    }
}

export class ParameterList extends Node {
    constructor(
        startIndex,
        stopIndex,
        fixedParameterList,
        optionalParameterList,
    ) {
        super(NodeType.ParameterList, startIndex, stopIndex);
        this.fixedParameterList = fixedParameterList;
        this.optionalParameterList = optionalParameterList;
        this.parameterList = fixedParameterList.concat(optionalParameterList);
    }
}

export class FunctionExpression extends Node {
    constructor(
        startIndex,
        stopIndex,
        fixedParameterList,
        optionalParameterList,
        returnType,
        functionBody,
    ) {
        super(NodeType.FunctionExpression, startIndex, stopIndex);
        this.fixedParameterList = fixedParameterList;
        this.optionalParameterList = optionalParameterList;
        this.parameterList = fixedParameterList.concat(optionalParameterList);
        this.returnType = returnType;
        this.functionBody = functionBody;
    }
}

// ------------------------------
// ERROR HANDLING EXPRESSION
// ------------------------------

export class OtherwiseClause extends Node {
    constructor(startIndex, stopIndex, defaultExpression) {
        super(NodeType.OtherwiseClause, startIndex, stopIndex);
        this.defaultExpression = defaultExpression;
    }
}

export class CatchClause extends Node {
    constructor(startIndex, stopIndex, parameterName, functionBody) {
        super(NodeType.CatchClause, startIndex, stopIndex);
        this.parameterName = parameterName;
        this.functionBody = functionBody;
    }
}

export class ErrorHandler extends Node {
    constructor(startIndex, stopIndex, otherwiseClause, catchClause) {
        super(NodeType.ErrorHandler, startIndex, stopIndex);
        this.otherwiseClause = otherwiseClause;
        this.catchClause = catchClause;
    }
}

export class ErrorHandlingExpression extends Node {
    constructor(
        startIndex,
        stopIndex,
        protectedExpression,
        otherwiseClause,
        catchClause,
    ) {
        super(NodeType.ErrorHandlingExpression, startIndex, stopIndex);
        this.protectedExpression = protectedExpression;
        this.otherwiseClause = otherwiseClause;
        this.catchClause = catchClause;
    }
}

// ------------------------------
// ERROR RAISING EXPRESSION
// ------------------------------

export class ErrorRaisingExpression extends Node {
    constructor(startIndex, stopIndex, expression) {
        super(NodeType.ErrorRaisingExpression, startIndex, stopIndex);
        this.expression = expression;
    }
}

// ------------------------------
// IF EXPRESSION
// ------------------------------

export class IfExpression extends Node {
    constructor(
        startIndex,
        stopIndex,
        ifCondition,
        trueExpression,
        falseExpression,
    ) {
        super(NodeType.IfExpression, startIndex, stopIndex);
        this.ifCondition = ifCondition;
        this.trueExpression = trueExpression;
        this.falseExpression = falseExpression;
    }
}

// ------------------------------
// EACH EXPRESSION
// ------------------------------

export class EachExpression extends Node {
    constructor(startIndex, stopIndex, expression) {
        super(NodeType.EachExpression, startIndex, stopIndex);
        this.expression = expression;
    }
}

// ------------------------------
// LET EXPRESSION
// ------------------------------

export class VariableName extends Node {
    constructor(startIndex, stopIndex, variableName) {
        super(NodeType.VariableName, startIndex, stopIndex);
        this.variableName = variableName;
    }
}

export class Variable extends Node {
    constructor(startIndex, stopIndex, variableName, expression) {
        super(NodeType.Variable, startIndex, stopIndex);
        this.variableName = variableName;
        this.expression = expression;
    }
}

export class VariableList extends Node {
    constructor(startIndex, stopIndex, variableList) {
        super(NodeType.VariableList, startIndex, stopIndex);
        this.variableList = variableList;
    }
}

export class LetExpression extends Node {
    constructor(startIndex, stopIndex, variableList, outputExpression) {
        super(NodeType.LetExpression, startIndex, stopIndex);
        this.variableList = variableList;
        this.outputExpression = outputExpression;
    }
}
