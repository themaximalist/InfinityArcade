const log = require("debug")("ia:controllers:games");

const Game = require("../models/game");
const GenerateGame = require("../services/GenerateGame");
const utils = require("../utils");
const { wcagContrast } = require("../services/colors");
const GetGames = require("../services/GetGames");
const axios = require("axios");

const NUM_GAMES_TO_SHOW = process.env.NUM_GAMES_TO_SHOW || 25;

async function scrapeWebsite(url) {
    // Basic URL validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        throw new Error('URL must start with http:// or https://');
    }

    const apiKey = process.env.SCRAPINGWEB_API_KEY;
    if (!apiKey) {
        throw new Error('SCRAPINGWEB_API_KEY is not set in the environment');
    }

    try {
        const response = await axios.get('https://scrapingweb.com/api/v1/text', {
            params: {
                apikey: apiKey,
                url: url
            }
        });

        if (response.data && response.data.text) {
            return response.data.text;
        } else {
            throw new Error('Invalid response from scraping API');
        }
    } catch (error) {
        console.error('Web scraping error:', error);
        throw new Error('Failed to scrape website');
    }
}

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
            const text = await scrapeWebsite(prompt_text);
            console.log(`scraped text: ${text}`);
            if (text) {
                prompt_text = `The following game idea details have been scraped from ${url}, please generate a game appropriate for this story: ${text}`;
            } else {
                prompt_text = `Extract any useful game details out of what content you think is at this URL ${url} and generate a game appropriate for the story.`;
            }
        }

        let model = (req.user ? req.user.model : process.env.AI_MODEL);

        const game = await GenerateGame(prompt_text, model);
        if (!game) {
            throw new Error("Could not generate game");
        }

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
    if (req.query.prompt_text) {
        return res.render("loading");
    } else {
        return res.render("generate");
    }
}

async function index(req, res) {
    const { games } = await GetGames(req.query, NUM_GAMES_TO_SHOW);
    return res.render("index", {
        games,
        search: req.query.search,
        user: req.user,
        NUM_GAMES_TO_SHOW
    });
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
        if (slug.indexOf("/") > -1 || slug.indexOf(".png") > -1) {
            if (slug.indexOf("http") !== 0) {
                return res.send(404, "Not Found");
            }
        }

        return res.redirect(`/generate?prompt_text=${encodeURIComponent(slug)}`);
    }
}

async function get_games(req, res) {
    try {
        const data = await GetGames(req.query, NUM_GAMES_TO_SHOW);
        return res.json({
            status: "success",
            data,
        });
    } catch (e) {
        return res.json({
            status: "error",
            message: `Error: Could not get games ${e.message}`
        });
    }
}

async function games_index(req, res) {
    const data = await GetGames(req.query, 100);
    if (req.query.search) {
        data.title = `${req.query.search.charAt(0).toUpperCase() + req.query.search.slice(1)} Text Games`;
        data.description = `Explore our extensive library of ${data.title}, browse by subgenre, or unleash your creativity with our innovative AI game generator to create your own custom text adventures.`;
    } else {
        data.title = "All Text Games";
        data.description = "Explore our extensive library of text-based games, browse by genre or subgenre, or unleash your creativity with our innovative AI game generator to create your own custom text adventures.";
    }
    return res.render("games", data);
}

module.exports = {
    get_games,
    index,
    games_index,
    create,
    generate,
    generate_handler,
    wildcard_handler,
};