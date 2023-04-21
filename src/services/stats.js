const log = require("debug")("ia:services:stats");

const sequelize = require("../sequelize"); // Make sure the path is correct
const { Op } = require("sequelize");

const User = require("../models/user");
const Game = require("../models/game");
const Chat = require("../models/chat");
const Session = require("../models/session");

async function getDailySummary() {
    const query = `
    SELECT date, SUM(sessions) as sessions, SUM(games) as games, SUM(chats) as chats, SUM(users) as users
    FROM (
      SELECT date_trunc('day', "createdAt")::date AS date, COUNT(*) AS sessions, 0 AS games, 0 AS chats, 0 AS users
      FROM "Sessions"
      GROUP BY date

      UNION ALL

      SELECT date_trunc('day', "createdAt")::date AS date, 0 AS sessions, COUNT(*) AS games, 0 AS chats, 0 AS users
      FROM "Games"
      GROUP BY date

      UNION ALL

      SELECT date_trunc('day', "createdAt")::date AS date, 0 AS sessions, 0 AS games, COUNT(*) AS chats, 0 AS users
      FROM "Chats"
      GROUP BY date

      UNION ALL

      SELECT date_trunc('day', "createdAt")::date AS date, 0 AS sessions, 0 AS games, 0 AS chats, COUNT(*) AS users
      FROM "Users"
      GROUP BY date
    ) as aggregated_data
    GROUP BY date
    ORDER BY date DESC;
  `;

    const summaryData = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
    });

    return summaryData;
}


async function getTotalCounts() {
    const totalUsers = await User.count();
    const totalGames = await Game.count();
    const totalChats = await Chat.count();
    const totalSessions = await Session.count();
    return {
        totalUsers,
        totalGames,
        totalChats,
        totalSessions,
    };
}



async function getTopSummary() {
    const games = await Game.findAll({
        attributes: {
            include: [
                [
                    sequelize.literal(`(
          SELECT COUNT(*)
          FROM "Chats" AS "gameChats"
          WHERE "gameChats"."GameId" = "Game"."id"
        )`),
                    'chatCount',
                ],
            ],
        },
        order: [
            [
                sequelize.literal(`(
        SELECT COUNT(*)
        FROM "Chats" AS "gameChats"
        WHERE "gameChats"."GameId" = "Game"."id"
      )`),
                'DESC',
            ],
        ],
        limit: 5,
    });

    return { games };
}




module.exports = {
    getDailySummary,
    getTotalCounts,
    getTopSummary,
};
