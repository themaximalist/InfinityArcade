const log = require("debug")("ia:services:ChatGame");

const Chat = require("../models/chat");
const GetChat = require("./GetChat");
const prompt = require("@themaximalist/prompt.js")
const LLM = require("@themaximalist/llm.js");
const parseTokenStream = require("./parseTokenStream");

async function* ChatGame(chat_id, content, user_id, model = process.env.LLM_MODEL, prompt_name = "ChatGame-v1") {
    log(`chatting game (chat_id=${chat_id}, user_id=${user_id}, model=${model})...`);

    try {
        const chat = await Chat.findOne({ where: { id: chat_id } });
        if (!chat) throw new Error(`Could not find chat with id ${chat_id}`);
        if (chat.UserId && chat.UserId !== user_id) throw new Error(`User ${user_id} does not own chat ${chat_id}`);

        const user_chat = await Chat.create({
            parent_id: chat.parent_id,
            session_id: chat.session_id,
            model: `${model}:${prompt_name}`,
            GameId: chat.GameId,
            UserId: user_id,
            role: "user",
            content,
        });
        if (!user_chat) throw new Error(`Could not create chat for user`);

        const chats = await GetChat(chat.parent_id);
        const messages = prompt.load(prompt_name, {
            chats,
        });

        let response = "";
        const llm = new LLM(messages, { model, stream: true });
        const stream = await llm.fetch({ parser: parseTokenStream });
        for await (const token of stream) {
            yield token;
            response += token.content;
        }

        const assistant_chat = await Chat.create({
            parent_id: chat.parent_id,
            session_id: chat.session_id,
            model: `${model}:${prompt_name}`,
            GameId: chat.GameId,
            UserId: user_id,
            role: "assistant",
            content: response,
        });

        if (!assistant_chat) throw new Error(`Could not create chat for assistant`);

        yield {
            "type": "end",
            chat_id: assistant_chat.id,
            parent_id: assistant_chat.parent_id
        };
    } catch (e) {
        log(`error chatting game ${e.message}`);
        return null;
    }
}

module.exports = ChatGame;