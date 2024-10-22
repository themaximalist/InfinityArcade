const { Game, Article } = require("../models");
const { SITE_URL } = process.env;
const { Op } = require("sequelize");

async function sitemap(req, res) {
    try {
        // Fetch public content
        const [games, articles] = await Promise.all([
            Game.findAll({ 
                where: { private: false },
                attributes: ['slug', 'updatedAt']
            }),
            Article.findAll({
                where: { publishedAt: { [Op.not]: null } },
                attributes: ['slug', 'updatedAt']
            })
        ]);

        // Build XML
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${SITE_URL}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${SITE_URL}/games</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${SITE_URL}/genres</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${SITE_URL}/articles</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${SITE_URL}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${SITE_URL}/faq</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    ${articles.map(article => `
    <url>
        <loc>${SITE_URL}/article/${article.slug}</loc>
        <lastmod>${article.updatedAt.toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>`).join('')}
    ${games.map(game => `
    <url>
        <loc>${SITE_URL}/${game.slug}</loc>
        <lastmod>${game.updatedAt.toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`).join('')}

</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).send('Error generating sitemap');
    }
}

module.exports = {
    sitemap
};
