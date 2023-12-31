require("dotenv").config();

const log = require("debug")("ia:make_images");

const Database = require("./database");
const Game = require("./models/game");

(async function main() {
    await Database.initialize();

    const games = await Game.findAll({});
    console.log(games.length);
    for (const game of games) {
        console.log(game.id, game.title);
        if (game.image_data) {
            console.log("- has image");
        }
    }
})();