const log = require("debug")("ia:controllers:art");

const sharp = require("sharp");
const Game = require("../models/game");
const GenerateGameArt = require("../services/GenerateGameArt");

async function generate(req, res) {
    try {
        const { game_id, chat_id } = req.query;
        if (game_id && !chat_id) {
            const game = await Game.findOne({ where: { id: game_id } });
            if (!game) throw new Error(`game with id ${game_id} not found`);

            if (game.image_data) return res.redirect(`/api/game/${game.slug}/art`);

            let model = (req.user ? req.user.model : process.env.LLM_MODEL);

            const art = await GenerateGameArt(game.llm_fields, model);
            if (!art) throw new Error(`art not generated`);

            await Game.update(art, { where: { id: game.id } });

            return res.redirect(`/api/game/${game.slug}/art`);
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
        let size = Number(req.query.size) || 512;
        const game = await Game.findOne({ where: { slug } });
        if (!game) throw new Error(`game with slug ${slug} not found`);

        if (size > 512) size = 512;
        if (size < 64) size = 64;

        if (game.image_data) {
            const contentType = (game.image_prompt_model === "replicate" ? "image/jpeg" : "image/png");

            let resizedImage;
            switch (game.image_prompt_model) {
                case "replicate":
                    resizedImage = await sharp(game.image_data).resize(size, size).jpeg().toBuffer();
                    break;
                case "stability":
                    resizedImage = await sharp(game.image_data).resize(size, size).png().toBuffer();
                    break;
                default:
                    throw new Error(`unknown image model name ${game.image_prompt_model}`);
            }



            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-control': 'public, max-age=3000'
            });

            res.end(resizedImage, "binary");
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