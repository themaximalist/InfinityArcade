async function verifyAdmin(req, res, next) {

    const user = req.user;

    if (!user) {
        return res.status(401).send("Unauthorized");
    }

    if (!user.admin) {
        return res.status(401).send("Unauthorized");
    }

    next();
}

module.exports = verifyAdmin;