const hackernews = require("../services/hackernews");

async function index(req, res) {
    res.render("news", {
        topStoriesData: await hackernews.topStoriesData(),
    });
}

module.exports = {
    index,
}