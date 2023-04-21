async function* parseTokenStream(response) {

    let last_token = null;
    let option = null;
    for await (const chunk of response.data) {
        const lines = chunk
            .toString("utf8")
            .split("\n")
            .filter((line) => line.trim().startsWith("data: "));

        for (const line of lines) {
            const message = line.replace(/^data: /, "");
            if (message === "[DONE]") {
                return;
            }

            const json = JSON.parse(message);
            const token = json.choices[0].delta.content;
            if (!token) continue;

            if (last_token && last_token.endsWith("\n") && token.match(/^\d$/)) {
                option = token;
                yield { type: `option${option}`, content: token };
                last_token = token;
                continue;
            }

            if (option) {
                if (token == "\n") {
                    option = null;
                } else {
                    yield { type: `option${option}`, content: token };
                }
            } else {
                yield { type: "content", content: token };
            }

            last_token = token;
        }
    }
}

module.exports = parseTokenStream;