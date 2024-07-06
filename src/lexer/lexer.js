import { getNextToken } from "./lexers/lexers.js";

// ------------------------------
// FULL LEXER
// ------------------------------

function lex(text) {
    let tokens = [];
    let i = 0;

    while (i < text.length) {
        const token = getNextToken(text.slice(i));
        if (token !== null) {
            token["start"] = i;
            token["end"] = i + token["value"].length;
            tokens.push(token);
            i = i + token["value"].length;
        } else {
            const errorMessage = `Failed to parse input text beyond index ${i}.`;
            throw new Error(errorMessage);
        }
    }

    return tokens;
}

export { lex };
