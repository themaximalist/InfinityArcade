const log = require("debug")("ia:services:GenerateGame");
const { AI } = require("@themaximalist/llm.js");
const prompt = require("@themaximalist/prompt.js");

async function GenerateGame(prompt_text = null, model = process.env.LLM_MODEL, prompt_name = "GenerateGame-v1") {
    log(`generating game (prompt_text=${prompt_text}, model=${model}, prompt_name=${prompt_name})...`);

    try {
        const input = prompt.load(prompt_name, { prompt_text });
        const game = JSON.parse(await AI(input, model));

        game.prompt_model = model;
        game.prompt_name = prompt_name;
        if (prompt_text) {
            game.prompt_text = prompt_text;
        }

        return game;
    } catch (e) {
        log(`error generating game ${e.message}`);
        return null;
    }
}

module.exports = GenerateGame;