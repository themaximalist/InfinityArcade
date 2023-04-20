const log = require("debug")("ia:services:stats");

const sequelize = require("../sequelize"); // Make sure the path is correct
const { Op } = require("sequelize");

const User = require("../models/user");
const Game = require("../models/game");
const Chat = require("../models/chat");
const Session = require("../models/session");

async function getDailySummary() {
    const sessions = await Session.findAll({
        attributes: [
            [sequelize.fn("date", sequelize.col("createdAt")), "date"],
            [sequelize.fn("count", sequelize.col("id")), "count"],
        ],
        group: ["date"],
    });

    const games = await Game.findAll({
        attributes: [
            [sequelize.fn("date", sequelize.col("createdAt")), "date"],
            [sequelize.fn("count", sequelize.col("id")), "count"],
        ],
        group: ["date"],
    });

    const chats = await Chat.findAll({
        attributes: [
            [sequelize.fn("date", sequelize.col("createdAt")), "date"],
            [sequelize.fn("count", sequelize.col("id")), "count"],
        ],
        group: ["date"],
    });

    const users = await User.findAll({
        attributes: [
            [sequelize.fn("date", sequelize.col("createdAt")), "date"],
            [sequelize.fn("count", sequelize.col("id")), "count"],
        ],
        group: ["date"],
    });

    const summaryData = {};

    const mergeData = (data, key) => {
        data.forEach((item) => {
            const date = item.get("date");
            if (!summaryData[date]) {
                summaryData[date] = {
                    date,
                    sessions: 0,
                    games: 0,
                    chats: 0,
                    users: 0,
                };
            }
            summaryData[date][key] = item.get("count");
        });
    };

    mergeData(sessions, "sessions");
    mergeData(games, "games");
    mergeData(chats, "chats");
    mergeData(users, "users");

    return Object.values(summaryData).sort((a, b) => new Date(b.date) - new Date(a.date));
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
