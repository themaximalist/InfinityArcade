const log = require("debug")("ia:ai");

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function AI(prompt) {
    return await Chat([{ "role": "user", "content": prompt }])
}

async function Chat(messages, model = "gpt-3.5-turbo") {
    log(`Generating Chat response for ${JSON.stringify(messages)} message (model: ${model})`);

    try {
        const completion = await openai.createChatCompletion({
            model,
            messages,
        });

        return completion.data.choices[0].message.content.trim();
    } catch (error) {
        log(`Error generating AI response: ${error}`);
        return null;
    }
}

async function* StreamChat(messages, model = "gpt-3.5-turbo") {
    try {
        const response = await openai.createChatCompletion(
            {
                model,
                messages,
                stream: true,
            },
            { responseType: "stream" }
        );

        for await (const message of parseStream(response)) {
            yield message;
        }
    } catch (e) {
        log(`Error streaming AI response: ${e}`);
        return;
    }
}

async function* parseStream(response) {

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

module.exports = {
    AI,
    Chat,
    StreamChat,
};