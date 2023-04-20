const log = require("debug")("ia:controllers:games");

const Game = require("../models/game");
const GenerateGame = require("../services/GenerateGame");
const sequelize = require("../sequelize");
const utils = require("../utils");
const { scrape } = require("../services/scraper");
const { wcagContrast } = require("../services/colors");

async function create(req, res) {
    try {
        const game = await Game.create(req.body);
        log(`created game ${JSON.stringify(game)}`);
        return res.json({
            status: "success",
            data: {
                id: game.id,
                slug: game.slug,
            }
        });
    } catch (e) {
        log(`error creating game ${e.message}`);
        return res.json({
            status: "error",
            message: `Error: Could not create game ${e.message}`
        });
    }
}

async function generate(req, res) {
    try {
        let { prompt_text } = req.body;
        if (utils.isURL(prompt_text)) {
            const url = prompt_text;
            const text = await scrape(prompt_text);
            if (text) {
                prompt_text = `The following game idea details have been scraped from ${url}, please generate a game appropriate for this story: ${text}`;
            } else {
                prompt_text = `Extract any useful game details out of what content you think is at this URL ${url} and generate a game appropriate for the story.`;
            }
        }

        let model = (req.user ? req.user.model : process.env.MODEL);

        const game = await GenerateGame(prompt_text, model);
        if (req.user) {
            game.UserId = req.user.id;
            game.private = req.user.private;
        }

        const saved = await Game.create(game);

        return res.json({
            status: "success",
            data: saved.dataValues
        });
    } catch (e) {
        return res.json({
            status: "error",
            message: `Error: Could not create game ${e.message}`
        });
    }
}

async function generate_handler(req, res) {
    return res.render("generate");
}

async function index(req, res) {
    const games = (await Game.findAll({
        where: {
            private: false
        },
        order: [["id", "DESC"]],
        limit: 500
    })).map(g => g.dataValues);
    return res.render("index", { games, user: req.user });
}

async function wildcard_handler(req, res) {
    const slug = req.params[0];

    const game = await Game.findOne({ where: { slug } });
    if (game) {
        if (game.private) {
            if (!req.user) return res.redirect("/login");
            if (game.UserId !== req.user.id) return res.redirect("/login");
        }

        const contrast_color = wcagContrast(game.primary_color);
        return res.render("game", {
            game: game.dataValues,
            user: req.user,
            contrast_color,
        });
    } else {
        return res.redirect(`/generate?prompt_text=${encodeURIComponent(slug)}`);
    }
}

module.exports = {
    index,
    create,
    generate,
    generate_handler,
    wildcard_handler,
};