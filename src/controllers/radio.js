const log = require("debug")("ia:controllers:radio");
const Game = require("../models/game");
const GenerateGameMusic = require("../services/GenerateGameMusic");

async function generate(req, res) {
    try {
        const { id } = req.body;
        const game = await Game.findOne({ where: { id } });
        if (!game) throw new Error("Game not found");
        if (game.music_prompt_text) throw new Error("Music already generated");

        const music = await GenerateGameMusic(game);
        console.log(music);

        await game.update({
            music_prompt_text: music.prompt,
            music_prompt_seed_image: music.seedImageId,
        });

        return res.json({
            status: "success",
            data: music,
        });
    } catch (e) {
        log(`error generating game music ${e.message}`);
        return res.json({
            status: "error",
            message: `Error: Could not generate game music ${e.message}`
        });
    }
}

module.exports = { generate };