const log = require("debug")("ia:services:GetChat");
const Chat = require("../models/chat");
const { Op } = require("sequelize");

const parseContent = require("./ParseContent");

function processChat(chat) {
    if (chat.role == "assistant") {
        chat.data = parseContent(chat.content);
    }
    return chat;
}

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
    })).map(chat => processChat(chat.dataValues));
}

module.exports = GetChat;