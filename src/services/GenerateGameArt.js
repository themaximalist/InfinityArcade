const log = require("debug")("ia:services:GenerateGameArt");
const AI = require("@themaximalist/ai.js");
const prompt = require("@themaximalist/prompt.js");

async function GenerateGameArt(game,
    concept_model = process.env.AI_MODEL,
    image_prompt_name = "GenerateGameArt-v1",
    image_prompt_service = process.env.AI_IMAGE_SERVICE,
    image_prompt_model = process.env.AI_IMAGE_MODEL) {

    log(`generating game art (game=${JSON.stringify(game)}, concept_model=${concept_model}, prompt_name=${image_prompt_name})...`);

    try {
        const concept_prompt = prompt.load(image_prompt_name);
        const image = new AI.Image(JSON.stringify(game), {
            service: image_prompt_service,
            model: image_prompt_model,
            concept_model,
            concept_prompt,
        });

        const image_data = await image.concept();
        const image_prompt_text = image.generated_prompt;

        const model = `${image.service}:${image.model}`;
        return {
            image_prompt_model: model,
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
