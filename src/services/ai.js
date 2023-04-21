const log = require("debug")("ia:ai");

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function Chat(messages, model = process.env.LLM_MODEL) {
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

module.exports = {
    Chat,
};