require("dotenv").config();

const log = require("debug")("ia:make_images");

const fs = require("fs");
const sharp = require("sharp");

const Database = require("./database");
const Game = require("./models/game");

(async function main() {
    await Database.initialize();

    const games = await Game.findAll({});
    console.log(games.length);
    for (const game of games) {
        const filename = `./public/images/art/${game.id}.png`;
        const filename_256 = `./public/images/art/${game.id}-256.png`;
        const filename_50 = `./public/images/art/${game.id}-50.png`;
        if (fs.existsSync(filename)) {
            console.log("- already has image");
            continue;
        }

        if (game.image_data) {
            console.log(`- generating ${filename}`);

            const image = await sharp(game.image_data).png();

            await image.toFile(filename);
            await image.resize(256, 256).toFile(filename_256);
            await image.resize(50, 50).toFile(filename_50);
        }
    }
})();