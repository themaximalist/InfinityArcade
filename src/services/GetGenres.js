const Game = require("../models/game");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");

async function GetGenres(query = null, NUM_GAMES_TO_SHOW = 100) {
    if (!query) query = {};

    const page = parseInt(query.page) || 1;
    let limit = parseInt(query.limit) || NUM_GAMES_TO_SHOW;
    if (limit > 500) limit = 500;
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
            genre: { [Op.iLike]: `%${search}%` },
            subgenre: { [Op.iLike]: `%${search}%` }
        };
    }

    const [genreResults, subgenreResults] = await Promise.all([
        Game.findAndCountAll({
            where,
            attributes: [
                'genre',
                [Sequelize.fn('MAX', Sequelize.col('id')), 'id'],
                [Sequelize.fn('COUNT', Sequelize.col('*')), 'count']
            ],
            group: ['genre'],
            order: [['genre', 'ASC']]
        }),
        Game.findAndCountAll({
            where,
            attributes: [
                'subgenre',
                [Sequelize.fn('MAX', Sequelize.col('id')), 'id'],
                [Sequelize.fn('COUNT', Sequelize.col('*')), 'count']
            ],
            group: ['subgenre'],
            order: [['subgenre', 'ASC']]
        })
    ]);

    // Create a map to store combined counts
    const itemMap = new Map();

    // Process genres
    for (const row of genreResults.rows) {
        const item = row.genre?.toLowerCase();
        if (!item) continue;
        
        itemMap.set(item, {
            item: row.genre,
            id: row.id,
            count: parseInt(row.get('count')),
            type: 'genre'
        });
    }

    // Process and combine subgenres
    for (const row of subgenreResults.rows) {
        const item = row.subgenre?.toLowerCase();
        if (!item) continue;

        if (itemMap.has(item)) {
            // If item exists, add the counts together
            const existing = itemMap.get(item);
            existing.count += parseInt(row.get('count'));
            // Keep the higher ID
            existing.id = Math.max(existing.id, row.id);
            // If it was found in both, mark it as both
            existing.type = 'both';
        } else {
            itemMap.set(item, {
                item: row.subgenre,
                id: row.id,
                count: parseInt(row.get('count')),
                type: 'subgenre'
            });
        }
    }

    const items = Array.from(itemMap.values());
    items.sort((a, b) => b.count - a.count);

    const paginatedItems = items.slice(offset, offset + limit);

    return { items: paginatedItems, search, totalGenres: items.length, page, limit, offset };
}

module.exports = GetGenres;