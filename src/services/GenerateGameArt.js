const log = require("debug")("ia:services:GenerateGameArt");
const { Chat } = require("./ai");
const prompts = require("./prompts");
const { slugify, streamToDisk } = require("../utils");
const path = require("path");
const { stablediffusion } = require("./images");
const fetch = require("node-fetch");

async function GenerateGameArt(game, image_prompt_name = "GenerateGameArt-v1") {
    log(`generating game art (game=${JSON.stringify(game)}, prompt_name=${image_prompt_name})...`);

    try {
        const messages = prompts.load(image_prompt_name, { game });
        const image_prompt_text = await Chat(messages);
        const remote_image_url = await stablediffusion(image_prompt_text);


        // const image_name = `${slugify(game.title)}-${Date.now()}.jpg`;
        // const image_path = path.join(__dirname, "..", "..", "public", "images", "generated", image_name);
        // const image_url = `/images/generated/${image_name}`;

        // await streamToDisk(remote_image_url, image_path);

        const response = await fetch(remote_image_url);
        const image_data = await response.buffer();

        const art = {
            image_prompt_name,
            image_prompt_text,
            image_data,
        };

        log(`generated art ${JSON.stringify(art)}`);

        return art;
    } catch (e) {
        log(`error generating game art ${e.message}`);
        return null;
    }
}

module.exports = GenerateGameArt;

// TODO: Convert GameArt/GameScene to same code base just different prompt
// TODO: Stream in image from remote url...don't poll on game art