const log = require("debug")("ia:controllers:admin");
const stats = require("../services/stats");

async function index(req, res) {
    const dailySummary = await stats.getDailySummary();
    const totalCounts = await stats.getTotalCounts();
    const topSummary = await stats.getTopSummary();
    return res.render("admin/index", { dailySummary, totalCounts, topSummary });
}

module.exports = {
    index,
};