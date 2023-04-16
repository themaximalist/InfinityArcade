const User = require("../models/user");

async function verifyUser(req, res, next) {
    const { userId } = req.signedCookies;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(401).send("Unauthorized");
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send("Unauthorized");
    }
}

module.exports = verifyUser;