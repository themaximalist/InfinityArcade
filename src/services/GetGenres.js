const Game = require("../models/game");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");

async function GetGenres(query = null) {
    if (!query) query = {};

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

    return { items, search };
}

module.exports = GetGenres;