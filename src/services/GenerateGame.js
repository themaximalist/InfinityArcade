const log = require("debug")("ia:services:GenerateGame");
const { AI } = require("@themaximalist/llm.js");
const prompts = require("./prompts");

async function GenerateGame(prompt_text = null, model = process.env.MODEL, prompt_name = "GenerateGame-v1") {
    log(`generating game (prompt_text=${prompt_text}, model=${model}, prompt_name=${prompt_name})...`);

    try {
        const prompt = prompts.load(prompt_name, { prompt_text });
        const game = JSON.parse(await AI(prompt, model));

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