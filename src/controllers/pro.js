const log = require("debug")("ia:controllers:pro");
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

async function index(req, res) {
    res.render("pro", {
        STRIPE_PURCHASE_LINK: process.env.STRIPE_PURCHASE_LINK,
        title: "Pro",
        description: "Infinity Arcade Pro is a one-time payment that unlocks additional features and benefits."
    });
}

module.exports = { index };