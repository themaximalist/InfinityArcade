require("dotenv").config();

const Database = require("../src/database");
const log = require("debug")("ia:scripts:generate_missing_images");
const GetGames = require("../src/services/GetGames");
const GenerateGameArt = require("../src/services/GenerateGameArt");
const Game = require("../src/models/game");
const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");
const { join } = require("path");

const prompt = require("@themaximalist/prompt.js");
const promptDir = join(__dirname, "..", "data", "prompts");
prompt.configure({ promptDir });

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateMissingImages() {
    try {
        log("Starting to generate missing images...");

        // 1. Find all games with no image data
        const { games } = await GetGames({ filter: "empty_image" }, 100, { image_prompt_model: null });
        log(`Found ${games.length} games with missing images`);

        // 2. Generate image data for each game
        for (let i = 0; i < games.length; i++) {
            const game = games[i];
            log(`Generating image for game: ${game.title} (ID: ${game.id})`);

            const art = await GenerateGameArt(game.llm_fields, process.env.AI_MODEL);
            if (!art || !art.image_data) {
                log(`Failed to generate art for game: ${game.title}`);
                continue;
            }

            // Save the image and create thumbnails
            const baseFilename = path.join(__dirname, "..", "public", "images", "art", `${game.id}`);
            const image = sharp(art.image_data);

            await Promise.all([
                image.clone().png().toFile(`${baseFilename}.png`),
                image.clone().resize(256, 256).png().toFile(`${baseFilename}-256.png`),
                image.clone().resize(50, 50).png().toFile(`${baseFilename}-50.png`)
            ]);

            // Update the game record in the database
            delete art.image_data;
            await Game.update(art, { where: { id: game.id } });

            log(`Successfully generated and saved images for game: ${game.title}`);

            // Add sleep every 7 iterations
            if ((i + 1) % 7 === 0) {
                log("Pausing for 5 seconds...");
                await sleep(5000);
            }
        }

        log("Finished generating missing images");
    } catch (error) {
        log(`Error in generateMissingImages: ${error.message}`);
    }
}


(async () => {
    await Database.initialize();

    // Run the script
    await generateMissingImages();



    process.exit(0);
})();
