const log = require("debug")("ia:services:GenerateGame");
const prompt = require("@themaximalist/prompt.js");

function parser(contents) {
    if (contents.startsWith("```json")) {
        contents = contents.substring("```json".length).trimLeft();
    }

    if (contents.endsWith("```")) {
        contents = contents.substring(0, contents.length - "```".length).trimRight();
    }

    return JSON.parse(contents);
}

async function GenerateGame(prompt_text = null, model = process.env.AI_MODEL, prompt_name = "GenerateGame-v1") {
    log(`generating game (prompt_text=${prompt_text}, model=${model}, prompt_name=${prompt_name})...`);

    const AI = (await import("@themaximalist/ai.js")).default;

    try {
        const input = prompt.load(prompt_name, { prompt_text });
        const game = await AI(input, {
            model,
            parser,
        });

        game.prompt_model = model;
        game.prompt_name = prompt_name;
        if (prompt_text) {
            game.prompt_text = prompt_text;
        }

        return game;
    } catch (e) {
        throw e;
        log(`error generating game ${e.message}`);
        return null;
    }
}

module.exports = GenerateGame;