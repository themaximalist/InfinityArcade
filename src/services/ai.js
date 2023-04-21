const log = require("debug")("ia:ai");

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function Chat(messages, model = process.env.MODEL) {
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

/*
async function* StreamChat(messages, model = process.env.MODEL) {
    log(`StreamChat response for ${messages.length} message (model: ${model})`);
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
*/



module.exports = {
    Chat,
    // StreamChat,
};