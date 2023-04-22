
function status(req, res) {
    res.send("ok");
}

function about(req, res) {
    res.render("about");
}

function faq(req, res) {
    res.render("faq");
}

module.exports = {
    status,
    about,
    faq,
};