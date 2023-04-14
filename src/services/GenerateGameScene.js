
const log = require("debug")("ia:services:GenerateGameScene");
const ChatAI = require("./ai").Chat;

const Game = require("../models/game");
const Chat = require("../models/chat");
const GetChat = require("./GetChat");

const prompts = require("./prompts");
const { stablediffusion } = require("./images");

async function GenerateGameScene(chat_id, image_prompt_name = "GenerateGameScene-v1") {
    log(`generating game scene art (chat_id=${chat_id}, prompt_name=${image_prompt_name})...`);

    try {
        const chat = await Chat.findByPk(chat_id);
        if (!chat) throw new Error(`chat with id ${chat_id} not found`);

        if (chat && chat.image_url) {
            return {
                image_prompt_name: chat.image_prompt_name,
                image_prompt_text: chat.image_prompt_text,
                image_url: chat.image_url,
            };
        }

        const chats = await GetChat(chat.parent_id);
        if (!chats || chats.length == 0) throw new Error(`chat with id ${chat_id} not found`);

        const chat_game = await Game.findByPk(chats[0].GameId);
        if (!chat_game) throw new Error(`game with id ${chats[0].GameId} not found`);

        const game = chat_game.llm_fields;

        const scene_text = chats.slice(-2).map(chat => {
            return `${chat.role}: ${chat.content}`
        }).join("\n");

        const messages = prompts.load(image_prompt_name, {
            game,
            image_prompt_text: chat_game.image_prompt_text,
            scene_text,
        });

        const image_prompt_text = await ChatAI(messages);
        const remote_image_url = await stablediffusion(image_prompt_text);


        const image_name = `${chat_id}_${Date.now()}.jpg`;
        console.log(image_name);
        const image_path = path.join(__dirname, "..", "..", "public", "images", "generated", image_name);
        console.log(image_path);
        const image_url = `/images/generated/${image_name}`;
        console.log(image_url);

        request(art.image_url).pipe(fs.createWriteStream(image_path));
        if (!fs.syncExists(image_path)) throw new Error(`image not generated`)

        const art = {
            image_prompt_name,
            image_prompt_text,
            image_url
        };

        await Chat.update(art, { where: { id: chat.id } });

        return art;
    } catch (e) {
        log(`error generating game art ${e.message}`);
        return null;
    }
}

module.exports = GenerateGameScene;