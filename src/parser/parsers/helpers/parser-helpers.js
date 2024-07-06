// ------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------

function nextTokenIs(targetToken, tokens, pointer) {
    let isTargetToken = false;

    const nextToken = tokens[pointer];
    if (nextToken && nextToken.token === targetToken) {
        isTargetToken = true;
    }

    return isTargetToken;
}

function nextTokenValueIs(targetTokenValue, tokens, pointer) {
    let isTargetToken = false;

    const nextToken = tokens[pointer];
    if (nextToken && nextToken.value === targetTokenValue) {
        isTargetToken = true;
    }

    return isTargetToken;
}

function nextTokenTypeIs(targetTokenType, tokens, pointer) {
    let isTargetToken = false;

    const nextToken = tokens[pointer];
    if (nextToken && nextToken.tokenType === targetTokenType) {
        isTargetToken = true;
    }

    return isTargetToken;
}

export { nextTokenIs, nextTokenValueIs, nextTokenTypeIs };
