import { TokenType } from "../language/tokens.js";
import { lex } from "../lexer/lexer.js";
import { parseExpression } from "./parsers/parsers.js";

// ------------------------------
// FULL PARSER
// ------------------------------

// remove whitespace and comment tokens
// add 'separatedToNextTokenOnlyByBlanks' property to all tokens
// will be used by the parser to parse generalized tokens
function filterTokens(tokens) {
    const regexSpacesOnly = new RegExp("^\\u0020+$", "u");

    let filteredTokens = [];
    let tokensToBeFilteredOut = [];

    for (const token of tokens) {
        if (
            token.tokenType === TokenType.Whitespace ||
            token.tokenType === TokenType.Comment
        ) {
            tokensToBeFilteredOut.push(token);
        } else {
            token["blanksToNext"] = false;
            filteredTokens.push(token);

            let previousToken = filteredTokens[filteredTokens.length - 2];
            if (previousToken !== undefined) {
                if (tokensToBeFilteredOut.length === 1) {
                    const separator = tokensToBeFilteredOut[0].value;
                    const regexMatch = separator.match(regexSpacesOnly);
                    if (regexMatch) {
                        previousToken["blanksToNext"] = true;
                    }
                }
            }
            tokensToBeFilteredOut = [];
        }
    }

    return filteredTokens;
}

function parse(tokens) {
    tokens = filterTokens(tokens);

    let node = null;
    node = parseExpression(tokens, 0);
    if (node !== null) {
        if (node.stopIndex !== tokens.length) {
            throw new Error("Failed to parse input tokens.");
        }
    }

    return node;
}

function lexAndParse(input) {
    const tokens = lex(input);
    const ast = parse(tokens);
    return ast;
}

export { filterTokens, parse, lexAndParse };
