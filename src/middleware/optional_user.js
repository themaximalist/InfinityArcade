const User = require("../models/user");

async function optionalUser(req, res, next) {
    const { userId } = req.signedCookies;
    try {
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error("Unauthorized");
        }

        req.user = user.dataValues;
        next();
    } catch (error) {
        req.user = null;
        next();
    }
}

module.exports = optionalUser;