const log = require("debug")("ia:controllers:pro");

async function index(req, res) {
    res.render("pro");
}

module.exports = { index };