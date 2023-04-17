const log = require("debug")("ia:controllers:pro");
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

async function index(req, res) {
    res.render("pro");
}

module.exports = { index };