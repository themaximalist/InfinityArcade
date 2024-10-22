const Game = require("../models/game");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");

async function GetGenres(query = null, key = "genre") {
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
            [key]: { [Op.iLike]: `%${search}%` },
        };
    }

    const { count: itemCount, rows } = await Game.findAndCountAll({
        where,
        attributes: [
            key,
            [Sequelize.fn('MAX', Sequelize.col('id')), 'id'],
        ],
        group: [key],
        order: [[key, 'ASC']],
    });

    const counts = {};
    for (let { [key]: item, count } of itemCount) {
        item = item.toLowerCase();
        if (counts[item]) {
            counts[item] += count;
        } else {
            counts[item] = count;
        }
    }

    const items = [];
    const added = [];
    for (const row of rows) {
        if (added.includes(row.dataValues[key].toLowerCase())) continue;
        added.push(row.dataValues[key].toLowerCase());

        items.push({
            item: row.dataValues[key],
            id: row.id,
            count: counts[row[key].toLowerCase()]
        });
    }

    items.sort((a, b) => b.count - a.count);

    return { items, search };
}

module.exports = GetGenres;