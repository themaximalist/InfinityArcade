const log = require("debug")("ia:services:GenerateGameArt");
const { Chat } = require("@themaximalist/llm.js");
const prompts = require("./prompts");
const { replicate2image, stability2image } = require("./images");

async function GenerateGameArt(game,
    concept_model = process.env.OPENAI_MODEL,
    image_prompt_name = "GenerateGameArt-v1",
    image_prompt_model = process.env.IMAGE_MODEL) {
    log(`generating game art (game=${JSON.stringify(game)}, concept_model=${concept_model}, prompt_name=${image_prompt_name}, image_dimensions=${image_prompt_model})...`);

    try {
        const messages = prompts.load(image_prompt_name, { game });
        const image_prompt_text = await Chat(messages, concept_model);

        let image_data;
        switch (image_prompt_model) {
            case "replicate":
                image_data = await replicate2image(image_prompt_text);
                break;
            case "stability":
                image_data = await stability2image(image_prompt_text);
                break;
            default:
                throw new Error(`unknown image_prompt_model ${image_prompt_model}`);
        }

        return {
            image_prompt_model,
            image_prompt_name,
            image_prompt_text,
            image_data,
        };
    } catch (e) {
        log(`error generating game art ${e.message}`);
        return null;
    }
}

module.exports = GenerateGameArt;