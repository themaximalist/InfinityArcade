const log = require("debug")("ia:services:GetChat");
const Chat = require("../models/chat");
const { Op } = require("sequelize");

async function GetChat(parent_id) {
    return (await Chat.findAll({
        where: {
            [Op.or]: [
                { id: parent_id },
                { parent_id }
            ]
        },
        order: [
            ["id", "ASC"]
        ]
    })).map(chat => chat.dataValues);
}

module.exports = GetChat;