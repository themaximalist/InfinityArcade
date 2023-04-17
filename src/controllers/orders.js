const log = require("debug")("ia:controllers:orders");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Order = require("../models/order");

async function webhook(req, res) {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_ENDPOINT_SECRET);
        if (event.type == "checkout.session.completed") {
            const client_reference_id = event.data.object.client_reference_id;
            if (!client_reference_id) {
                throw new Error("No client reference id");
            }

            console.log("EVENT", JSON.stringify(event.data.object, null, 4));

            const order = await Order.create({
                stripe_id: event.data.object.id,
                email: event.data.object.customer_details.email,
                client_reference_id,
                customer_details: event.data.object.customer_details,
                total: event.data.object.amount_total,
            });

            if (!order) {
                throw new Error("No order created");
            }

            log(`created new order #${order.id} for ${order.email} (client_reference_id=${order.client_reference_id})`);
        }

        res.status(200).end();
    } catch (e) {
        console.log("WEBHOOK ERROR", e);
        return res.status(400).send(`Webhook Error: ${e.message}`);
    }
}

module.exports = {
    webhook,
};