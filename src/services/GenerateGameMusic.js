const log = require("debug")("ia:services:GenerateGameMusic");
const prompt = require("@themaximalist/prompt.js");
const { shuffle } = require("../utils");

const SEED_IMAGES = ["og_beat", "agile", "marim", "motorway", "vibes"];
function randomSeedImage() {
    return shuffle(SEED_IMAGES)[0];
}

async function GenerateGameMusic(game, model = process.env.AI_MODEL, prompt_name = "GenerateGameMusic-v1") {
    log(`generating game music (game=${game.llm_fields}, model=${model}, prompt_name=${prompt_name})...`);

    const AI = (await import("@themaximalist/ai.js")).default;

    try {
        const input = prompt.load(prompt_name, { game: game.llm_fields });
        const keywords = await AI(input, { model: "gpt-4" });

        const music = {
            seed: 1,
            prompt: keywords,
            seedImageId: randomSeedImage(),
        };

        log(`generated music ${JSON.stringify(music)}`);

        return music;
    } catch (e) {
        log(`error generating music ${e.message}`);
        return null;
    }
}

module.exports = GenerateGameMusic;