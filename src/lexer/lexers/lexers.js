import * as patterns from "./lexicalStructure.js";

import {
    TokenType,
    Whitespace,
    Comment,
    Literal,
    Identifier,
    GeneralizedIdentifier,
    operatorOrPuctuatorToTokenMapping,
    keywordToTokenMapping,
} from "../../language/tokens.js";

export function getOperatorOrPunctuatorToken(text) {
    let token = null;

    const regexMatch = text.match(patterns.regexOperatorOrPunctuator);
    if (regexMatch) {
        const lexeme = regexMatch[0];
        token = {
            tokenType: TokenType.OperatorOrPunctuator,
            token: operatorOrPuctuatorToTokenMapping[lexeme],
            value: lexeme,
        };
    }

    return token;
}

export function getKeywordToken(text) {
    let token = null;

    const regexMatch = text.match(patterns.regexKeyword);
    if (regexMatch) {
        const lexeme = regexMatch[1];

        if (lexeme === "true" || lexeme === "false") {
            token = {
                tokenType: TokenType.Literal,
                token: Literal.Logical,
                value: lexeme,
            };
        } else if (lexeme === "null") {
            token = {
                tokenType: TokenType.Literal,
                token: Literal.Null,
                value: lexeme,
            };
        } else {
            token = {
                tokenType: TokenType.Keyword,
                token: keywordToTokenMapping[lexeme],
                value: lexeme,
            };
        }
    }

    return token;
}

export function getSingleLineCommentToken(text) {
    let token = null;

    const regexMatch = text.match(patterns.regexSingleLineComment);
    if (regexMatch) {
        const lexeme = regexMatch[0];
        token = {
            tokenType: TokenType.Comment,
            token: Comment.SingleLine,
            value: lexeme,
        };
    }

    return token;
}

export function getDelimitedCommentToken(text) {
    let token = null;

    const regexMatch = text.match(patterns.regexDelimitedComment);
    if (regexMatch) {
        const lexeme = regexMatch[0];
        token = {
            tokenType: TokenType.Comment,
            token: Comment.Delimited,
            value: lexeme,
        };
    }

    return token;
}

export function getSpaceToken(text) {
    let token = null;

    const regexMatch = text.match(patterns.regexSpace);
    if (regexMatch) {
        const lexeme = regexMatch[0];
        token = {
            tokenType: TokenType.Whitespace,
            token: Whitespace.Whitespace,
            value: lexeme,
        };
    }

    return token;
}

export function getNewLineToken(text) {
    let token = null;

    const regexMatch = text.match(patterns.regexNewLine);
    if (regexMatch) {
        const lexeme = regexMatch[0];
        token = {
            tokenType: TokenType.Whitespace,
            token: Whitespace.NewLine,
            value: lexeme,
        };
    }

    return token;
}

export function getTextLiteralToken(text) {
    let token = null;

    const regexMatch = text.match(patterns.regexTextLiteral);
    if (regexMatch) {
        const lexeme = regexMatch[0];
        token = {
            tokenType: TokenType.Literal,
            token: Literal.Text,
            value: lexeme,
        };
    }

    return token;
}

export function getNumberLiteralToken(text) {
    let token = null;

    const regexMatch = text.match(patterns.regexNumberLiteral);
    if (regexMatch) {
        const lexeme = regexMatch[1];
        token = {
            tokenType: TokenType.Literal,
            token: Literal.Number,
            value: lexeme,
        };
    }

    return token;
}

export function getRegularIdentifierToken(text) {
    let token = null;

    const regexMatch = text.match(patterns.regexRegularIdentifier);

    if (regexMatch) {
        const lexeme = regexMatch[1];
        token = {
            tokenType: TokenType.Identifier,
            token: Identifier.Regular,
            value: lexeme,
        };
    }

    return token;
}

export function getQuotedIdentifierToken(text) {
    let token = null;

    const regexMatch = text.match(patterns.regexQuotedIdentifier);
    if (regexMatch) {
        const lexeme = regexMatch[1];
        token = {
            tokenType: TokenType.Identifier,
            token: Identifier.Quoted,
            value: lexeme,
        };
    }

    return token;
}

export function getGeneralizedIdentifierToken(text) {
    let token = null;

    const regexMatch = text.match(patterns.regexGeneralizedIdentifier);
    if (regexMatch) {
        const lexeme = regexMatch[1];
        token = {
            tokenType: TokenType.GeneralizedIdentifier,
            token: GeneralizedIdentifier.GeneralizedIdentifier,
            value: lexeme,
        };
    }

    return token;
}

export function getNextToken(text) {
    const functions = [
        getSingleLineCommentToken,
        getDelimitedCommentToken,
        getKeywordToken,
        getSpaceToken,
        getNewLineToken,
        getRegularIdentifierToken,
        getQuotedIdentifierToken,
        getTextLiteralToken,
        getNumberLiteralToken,
        getOperatorOrPunctuatorToken,
        getGeneralizedIdentifierToken,
    ];

    for (let func of functions) {
        const result = func(text);
        if (result !== null) {
            return result;
        }
    }
    return null;
}
