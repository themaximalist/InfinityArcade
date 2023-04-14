const log = require("debug")("ia:controllers:session");

const Session = require("../models/session");

async function create(req, res) {
    const session = await Session.create();
    log(`created session ${session.id}`);
    return res.json({
        status: "success",
        data: session.id,
    });
}

module.exports = { create };