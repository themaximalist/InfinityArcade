const log = require("debug")("ia:services:scraper");

const fetch = require("node-fetch");
async function scrape(url) {
    try {
        log(`scraping ${url}...`)
        const endpoint = `https://extractorapi.com/api/v1/extractor/?apikey=${process.env.EXTRACTOR_API_KEY}&url=${encodeURIComponent(url)}`;
        const response = await fetch(endpoint);

        const data = await response.json();
        return data.text;
    } catch (e) {
        log(`error scraping ${url}: ${e.message}`);
        return null;
    }
}

module.exports = {
    scrape,
};