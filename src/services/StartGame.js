const log = require("debug")("ia:services:StartGame");

const prompt = require("@themaximalist/prompt.js");
const Chat = require("../models/chat");
const ChatGame = require("./ChatGame");

async function* StartGame(game, session_id, user_id = null, model = process.env.AI_MODEL, prompt_name = "StartGame-v1") {
    log(`starting game (game=${game.slug}, user_id=${user_id}, model=${model}, session_id=${session_id})...`);

    try {
        // CREATE INITIAL GAME
        const messages = prompt.load(prompt_name, { game });

        let parent_id = null;
        let chat_id = null;
        for (const message of messages) {
            let chat = await Chat.create({
                parent_id,
                session_id,
                model: `${model}:${prompt_name}`,
                UserId: user_id,
                GameId: game.id,
                role: message.role,
                content: message.content,
            });

            chat_id = chat.id;
            if (!parent_id) {
                parent_id = chat_id;
            }

            log(`created chat (id=${chat_id})`);
        }

        for await (const response of ChatGame(chat_id, "Start Game", user_id, model)) {
            yield response;
        }
    } catch (e) {
        log(`error starting game ${e.message}`);
        return null;
    }
}

module.exports = StartGame;