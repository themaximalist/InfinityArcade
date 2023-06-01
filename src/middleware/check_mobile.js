async function checkMobile(req, res, next) {
    const useragent = req.headers["user-agent"];
    if (useragent.indexOf("Infinity Arcade iOS") > -1) {
        res.locals.mobile = true;
    } else {
        res.locals.mobile = false;
    }

    next();
}

module.exports = checkMobile;