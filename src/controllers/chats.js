const log = require("debug")("ia:controllers:chats");

const Game = require("../models/game");
const StartGame = require("../services/StartGame");
const ChatGame = require("../services/ChatGame");

async function start(req, res) {
    try {
        const { slug } = req.params;
        const game = await Game.findOne({ where: { slug } });
        if (!game) { throw new Error(`Error: Could not start game ${e.message}`) }

        const { session_id } = req.body;
        if (!session_id) { throw new Error(`Error: Could not start game, no session_id provided`) }

        for await (const token of StartGame(game, session_id)) {
            res.write(JSON.stringify(token) + "\n");
        }
    } catch (e) {
        res.write(JSON.stringify({ "type": "error", "message": e.mssasge }) + "\n");
    } finally {
        res.end();
    }
}

async function chat(req, res) {
    try {
        const { chat_id, content } = req.body;
        for await (const token of ChatGame(chat_id, content)) {
            res.write(JSON.stringify(token) + "\n");
        }
    } catch (e) {
        res.write(JSON.stringify({ "type": "error", "message": e.mssasge }) + "\n");
    } finally {
        res.end();
    }
}


module.exports = {
    start,
    chat,
}