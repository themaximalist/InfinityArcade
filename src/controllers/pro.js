const log = require("debug")("ia:controllers:pro");
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

async function index(req, res) {
    res.render("pro", {
        STRIPE_PURCHASE_LINK: process.env.STRIPE_PURCHASE_LINK,
    });
}

module.exports = { index };