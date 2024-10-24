const log = require("debug")("ia:controllers:genres");

const GetGenres = require("../services/GetGenres");
const GetGames = require("../services/GetGames");
const { unslugify, unslugify2 } = require("../utils");
const { Op } = require("sequelize");

const NUM_GAMES_TO_SHOW = process.env.NUM_GAMES_TO_SHOW || 100;

async function index(req, res) {
    const data = await GetGenres(req.query);
    data.title = "All Text Game Genres";
    data.description = "Explore our extensive library of text-based games, browse by genre or subgenre, or unleash your creativity with our innovative AI game generator to create your own custom text adventures.";
    return res.render("genres", data);
}

async function get_genre(req, res) {
    const { slug } = req.params;

    const wildcardSlug = slug.replace(/[-\/]/g, "%");
    const name = unslugify(slug);

    const data = await GetGames(req.query, NUM_GAMES_TO_SHOW, {
        [Op.or]: {
            genre: {
                [Op.iLike]: `${wildcardSlug}`
            },
            subgenre: {
                [Op.iLike]: `${wildcardSlug}` 
            }
        }
    });

    data.title = `${name} Text Games`;
    data.description = `Explore our extensive library of ${name} interactive text games, browse by subgenre, or unleash your creativity with our innovative AI game generator to create your own custom text adventures.`;
    data.slug = req.path;

    return res.render("games", data);
}

async function get_subgenre(req, res) {
    return res.redirect("/genres/" + req.params.slug);
}

async function subgenres_index(req, res) {
    return res.redirect("/genres");
}

module.exports = {
    index,
    subgenres_index,
    get_genre,
    get_subgenre,
};