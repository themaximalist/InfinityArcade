function status(req, res) {
    res.send("ok");
}

module.exports = {
    sessions: require("./sessions"),
    games: require("./games"),
    art: require("./art"),
    chats: require("./chats"),
    status,
};