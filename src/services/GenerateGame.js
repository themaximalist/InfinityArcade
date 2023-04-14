const log = require("debug")("ia:services:GenerateGame");
const utils = require("../utils");
const { AI } = require("./ai");
const prompts = require("./prompts");

async function GenerateGame(prompt_text = null, prompt_name = "GenerateGame-v1") {
    log(`generating game (prompt_text=${prompt_text}, prompt_name=${prompt_name})...`);

    try {
        const prompt = prompts.load(prompt_name, {
            prompt_text,
            "RANDOM_VIDEO_GAME_GENRES": utils.genres(),
        });

        const data = await AI(prompt);
        const game = JSON.parse(data);

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