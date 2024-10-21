const log = require("debug")("ia:controllers:admin");
const stats = require("../services/stats");
const GetGames = require("../services/GetGames");
const GenerateGameArt = require("../services/GenerateGameArt");

const ADMIN_KEY = process.env.ADMIN_KEY;

async function index(req, res) {
    const dailySummary = await stats.getDailySummary();
    const totalCounts = await stats.getTotalCounts();
    const topSummary = { games: [] }; //await stats.getTopSummary();
    return res.render("admin/index", { dailySummary, totalCounts, topSummary });
}

async function generate_missing_images(req, res) {
    if (!ADMIN_KEY) {
        return res.status(500).json({ status: "error", message: "ADMIN_KEY is not set in the environment" });
    }

    const { key } = req.query;

    if (key !== ADMIN_KEY) {
        return res.status(403).json({ status: "error", message: "Invalid admin key" });
    }

    try {
        const { games } = await GetGames({ filter: "empty_image" }, 10, { image_prompt_model: null });

        // const gamesWithUrls = games.map(game => ({
        //     ...game,
        //     generateUrl: `/api/art/generate?slug=${game.slug}&key=${ADMIN_KEY}`
        // }));

        res.render("admin/generate_missing_images", { games });
    } catch (error) {
        log(`Error in generate_missing_images: ${error.message}`);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

module.exports = {
    index,
    generate_missing_images
};
