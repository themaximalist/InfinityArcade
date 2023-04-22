const hackernews = require("../services/hackernews");

async function index(req, res) {
    res.render("news", {
        title: "News",
        description: "Hacker News top stories turned into interactive fiction games",
        topStoriesData: await hackernews.topStoriesData(),
    });
}

module.exports = {
    index,
}