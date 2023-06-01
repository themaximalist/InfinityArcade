
function status(req, res) {
    res.send("ok");
}

function privacy(req, res) {
    res.render("privacy", {
        title: "Privacy Policy",
        description: "Privacy Policy"
    });
}

function articles(req, res) {
    res.render("articles", {
        title: "Articles",
        description: "Articles about generative text adventure and interactive fiction games."
    });
}

function article(req, res) {
    // TODO: unsustainable
    if (req.params.slug === "how-to-create-your-own-text-adventure-game") {
        return res.render("articles/how-to-create-your-own-text-adventure-game", {
            title: "How to create your own text adventure game",
            description: "A step-by-step guide to creating your own text adventure game with Infinity Arcade in seconds."
        });
    } else if (req.params.slug === "generative-video-game-soundtracks") {
        return res.render("articles/generative-video-game-soundtracks", {
            title: "Generative Video Game Soundtracks",
            description: "How Infinity Arcade is using generative music to create video game soundtracks."
        });
    }
    res.status(404).send("Not found");
}

function about(req, res) {
    res.render("about", {
        title: "About",
        description: "About Infinity Arcade, a free and open source text adventure game engine."
    });
}

function faq(req, res) {
    res.render("faq", {
        title: "FAQ",
        description: "Frequently asked questions about Infinity Arcade, a free and open source text adventure game engine."
    });
}

module.exports = {
    status,
    about,
    articles,
    article,
    faq,
    privacy,
};