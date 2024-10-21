function parseTokenStream(token, state) {
    let { last_token, option } = state;

    if (last_token && last_token.endsWith("\n") && token.match(/^\d$/)) {
        option = token;
        return { type: `option${option}`, content: token, newState: { last_token: token, option } };
    }

    if (option) {
        if (token == "\n") {
            option = null;
        } else {
            return { type: `option${option}`, content: token, newState: { last_token: token, option } };
        }
    } else {
        return { type: "content", content: token, newState: { last_token: token, option } };
    }

    return { type: null, content: null, newState: { last_token: token, option } };
}

module.exports = parseTokenStream;
