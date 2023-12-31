const Game = require("../models/game");
const { Op } = require("sequelize");

async function GetGames(query = null, NUM_GAMES_TO_SHOW = process.env.NUM_GAMES_TO_SHOW || 25) {
    if (!query) query = {};

    const page = parseInt(query.page) || 1;
    let limit = parseInt(query.limit) || NUM_GAMES_TO_SHOW;
    if (limit > 100) limit = 100;
    const offset = (page - 1) * limit;

    const filter = query.filter;
    const search = query.search;

    const where = {
        private: false
    };

    if (filter == "empty_image") {
        where.image_prompt_model = null;
    } else {
        where.image_prompt_model = { [Op.ne]: null };
    }

    if (search) {
        where[Op.or] = {
            title: { [Op.iLike]: `%${search}%` },
            description: { [Op.iLike]: `%${search}%` },
            tagline: { [Op.iLike]: `%${search}%` },
            genre: { [Op.iLike]: `%${search}%` },
            subgenre: { [Op.iLike]: `%${search}%` },
            prompt_text: { [Op.iLike]: `%${search}%` },
            image_prompt_text: { [Op.iLike]: `%${search}%` },
        };
    }

    const { count: totalGames, rows: games } = await Game.findAndCountAll({
        where,
        order: [["id", "DESC"]],
        limit,
        offset,
    });

    const filteredGames = games.map(g => {
        return {
            id: g.id,
            title: g.title,
            tagline: g.tagline,
            genre: g.genre,
            subgenre: g.subgenre,
            description: g.description,
            primary_color: g.primary_color,
            slug: g.slug,
        };
    });

    return { totalGames, games: filteredGames, page, limit, offset, search };
}

module.exports = GetGames;