const log = require("debug")("ia:controllers:admin");
const stats = require("../services/stats");
const GetGames = require("../services/GetGames");
const GenerateGameArt = require("../services/GenerateGameArt");
const { Article } = require('../models');
const marked = require('marked');

const ADMIN_KEY = process.env.ADMIN_KEY;

function markdownToHtml(markdown) {
  return marked.parse(markdown);
}

async function index(req, res) {
    const dailySummary = await stats.getDailySummary();
    const totalCounts = await stats.getTotalCounts();
    const topSummary = { games: [] }; //await stats.getTopSummary();
    return res.render("admin/index", { dailySummary, totalCounts, topSummary });
}

async function generate_missing_images(req, res) {
    if (!ADMIN_KEY) {
        return res.status(500).json({ status: "error", message: "ADMIN_KEY is not set in the environment" });
    }

    const { key } = req.query;

    if (key !== ADMIN_KEY) {
        return res.status(403).json({ status: "error", message: "Invalid admin key" });
    }

    try {
        const { games } = await GetGames({ filter: "empty_image" }, 10, { image_prompt_model: null });

        // const gamesWithUrls = games.map(game => ({
        //     ...game,
        //     generateUrl: `/api/art/generate?slug=${game.slug}&key=${ADMIN_KEY}`
        // }));

        res.render("admin/generate_missing_images", { games });
    } catch (error) {
        log(`Error in generate_missing_images: ${error.message}`);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

async function articlesList(req, res) {
    try {
        const articles = await Article.findAll({
            order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']]
        });
        articles.forEach(article => {
            article.contentHtml = markdownToHtml(article.content);
        });
        res.render('admin/articles/list', { articles });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).send('Error fetching articles');
    }
}

async function createArticleForm(req, res) {
    res.render('admin/articles/create');
}

async function createArticle(req, res) {
    try {
        const { title, slug, description, content, author, publishDate } = req.body;
        await Article.create({
            title,
            slug,
            description,
            content,
            author,
            publishedAt: publishDate ? new Date(publishDate + 'T00:00:00Z') : null
        });
        res.redirect('/admin/articles');
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).send('Error creating article');
    }
};

async function editArticleForm(req, res) {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }
        article.contentHtml = markdownToHtml(article.content);
        res.render('admin/articles/edit', { article });
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).send('Error fetching article');
    }
};

async function updateArticle(req, res) {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }
        const { title, slug, description, content, author, publishDate } = req.body;
        await article.update({
            title,
            slug,
            description,
            content,
            author,
            publishedAt: publishDate ? new Date(publishDate + 'T00:00:00Z') : null
        });
        res.redirect('/admin/articles');
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).send('Error updating article');
    }
};

async function togglePublish(req, res) {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }
        await article.update({
            publishedAt: article.publishedAt ? null : new Date()
        });
        res.redirect('/admin/articles');
    } catch (error) {
        console.error('Error toggling article publish status:', error);
        res.status(500).send('Error toggling article publish status');
    }
};

async function deleteArticle(req, res) {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }
        await article.destroy();
        res.redirect('/admin/articles');
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).send('Error deleting article');
    }
}

module.exports = {
    index,
    generate_missing_images,
    articlesList,
    createArticleForm,
    createArticle,
    editArticleForm,
    updateArticle,
    togglePublish,
    deleteArticle
};
