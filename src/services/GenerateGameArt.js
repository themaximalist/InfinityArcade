const log = require("debug")("ia:services:GenerateGameArt");
const promptlib = require("@themaximalist/prompt.js");

async function GenerateGameArt(game,
    concept_model = process.env.AI_MODEL,
    image_prompt_name = "GenerateGameArt-v1",
    image_prompt_service = process.env.AI_IMAGE_SERVICE,
    image_prompt_model = process.env.AI_IMAGE_MODEL) {

    if (!game) {
        throw new Error("Game is required");
    }

    const AI = (await import("@themaximalist/ai.js")).default;

    log(`generating game art (game=${JSON.stringify(game)}, concept_model=${concept_model}, prompt_name=${image_prompt_name})...`);

    try {
        // const concept_prompt = promptlib.load(image_prompt_name);
        const { prompt, buffer } = await AI.Imagine.Concept(JSON.stringify(game), {
            service: image_prompt_service,
            model: image_prompt_model,
            concept: {
                model: concept_model,
            }
        });

        const image_data = buffer;
        const image_prompt_text = prompt;


        const model = `${image_prompt_service}:${image_prompt_model}`;
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
