const log = require("debug")("ia:controllers:art");

const Game = require("../models/game");
const GenerateGameScene = require("../services/GenerateGameScene");
const GenerateGameArt = require("../services/GenerateGameArt");
const request = require("request");

async function generate(req, res) {
    try {
        const { game_id, chat_id } = req.query;
        if (game_id && !chat_id) {
            const game = await Game.findOne({ where: { id: game_id } });
            if (!game) throw new Error(`game with id ${game_id} not found`);

            if (game.image_url) {
                return res.redirect(game.image_url);
            }

            const art = await GenerateGameArt(game.llm_fields);
            if (!art) throw new Error(`art not generated`);

            await Game.update(art, { where: { id: game.id } });

            return res.redirect(art.image_url)
        } else if (chat_id && !game_id) {
            console.log("GENERATE SCENEART");
        } else {
            throw new Error(`invalid request parameters`);
        }
    } catch (e) {
        return res.json({
            status: "error",
            message: `error generating game art: ${e.message}`
        });
    }
}

async function get(req, res) {
    try {
        const { slug } = req.params;
        const game = await Game.findOne({ where: { slug } });
        if (!game) throw new Error(`game with slug ${slug} not found`);

        if (game.image_url) {
            return res.json({
                status: "success",
                data: game.image_url
            });
        } else {
            throw new Error(`game with slug ${slug} has no art`)
        }
    } catch (e) {
        return res.json({
            status: "error",
            message: `cannot get art: ${e.message}`
        });
    }
}


module.exports = {
    generate,
    get
};