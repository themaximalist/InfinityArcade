async function* parseTokenStream(response) {
    let last_token = null;
    let option = null;
    let accumulatedData = ""; // Initialize an empty string to accumulate data

    for await (const chunk of response.data) {
        accumulatedData += chunk.toString("utf8"); // Accumulate chunks

        // Split accumulated data by newlines and process complete messages
        let lines = accumulatedData.split("\n");
        for (let i = 0; i < lines.length - 1; i++) { // Iterate until the second-to-last element
            const line = lines[i].trim();
            if (line.startsWith("data: ")) {
                const message = line.replace(/^data: /, "");
                if (message === "[DONE]") {
                    return;
                }

                try {
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
                } catch (e) {
                    // If JSON parsing fails, accumulate the data until a complete message is formed
                    continue;
                }
            }
        }

        // Preserve incomplete data for the next iteration
        accumulatedData = lines[lines.length - 1];
    }
}

module.exports = parseTokenStream;
