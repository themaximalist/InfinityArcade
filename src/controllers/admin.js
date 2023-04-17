const log = require("debug")("ia:controllers:admin");

const sequelize = require("../sequelize"); // Make sure the path is correct
const { Op } = require("sequelize");

const User = require("../models/user");
const Game = require("../models/game");
const Chat = require("../models/chat");
const Session = require("../models/session");

async function index(req, res) {
    const totalUsers = await User.count();
    const totalGames = await Game.count();
    const totalChats = await Chat.count();

    const top5Games = await Game.findAll({
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

    const top5Users = await User.findAll({
        attributes: {
            include: [
                [
                    sequelize.literal(`(
          SELECT COUNT(*)
          FROM "Chats" AS "userChats"
          WHERE "userChats"."UserId" = "User"."id"
        )`),
                    'chatCount',
                ],
            ],
        },
        order: [
            [
                sequelize.literal(`(
        SELECT COUNT(*)
        FROM "Chats" AS "userChats"
        WHERE "userChats"."UserId" = "User"."id"
      )`),
                'DESC',
            ],
        ],
        limit: 5,
    });


    const newUsersLast7Days = await User.count({
        where: {
            createdAt: {
                [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
            },
        },
    });

    const totalUniqueSessions = await Session.count({
        distinct: true,
        col: 'id'
    });

    res.render("admin/index", {
        totalUsers,
        totalGames,
        totalChats,
        top5Games,
        top5Users,
        newUsersLast7Days,
        totalUniqueSessions
    });
}

module.exports = {
    index,
};