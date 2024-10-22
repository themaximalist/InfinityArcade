const { Article } = require('../models');
const { Op } = require('sequelize');
const marked = require('marked');

function markdownToHtml(markdown) {
  return marked.parse(markdown);
}

function status(req, res) {
    res.send("ok");
}

function privacy(req, res) {
    res.render("privacy", {
        title: "Privacy Policy",
        description: "Privacy Policy"
    });
}

async function articles(req, res) {
    try {
        const allArticles = await Article.findAll({
            order: [['publishedAt', 'DESC']],
            where: {
                publishedAt: {
                    [Op.not]: null
                }
            }
        });
        
        allArticles.forEach(article => {
            article.contentHtml = markdownToHtml(article.content);
        });

        res.render("articles", {
            title: "Articles",
            description: "Articles about generative text adventure and interactive fiction games.",
            articles: allArticles
        });
    } catch (error) {
        console.error("Error fetching articles:", error);
        res.status(500).send("Error fetching articles");
    }
}

async function article(req, res) {
    try {
        const articleSlug = req.params.slug;
        const article = await Article.findOne({
            where: { slug: articleSlug }
        });

        if (!article) {
            return res.status(404).send("Article not found");
        }

        const contentHtml = markdownToHtml(article.content);

        res.render("article", {
            title: article.title,
            description: article.description,
            content: contentHtml,
            publishedAt: article.publishedAt,
            author: article.author
        });
    } catch (error) {
        console.error("Error fetching article:", error);
        res.status(500).send("Error fetching article");
    }
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
