const log = require("debug")("ia:services:hackernews");

const fetch = require("node-fetch");

let storyCache = {};
let cachedTopStories = [];
let lastTopStoriesFetch = null;

async function topStories(num = 30) {

    if (cachedTopStories.length == 0 || lastTopStoriesFetch && new Date() - lastTopStoriesFetch < 1000 * 60 * 5) {
        try {
            const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
            log(`fetching top stories...`);
            const stories = await response.json();
            lastTopStoriesFetch = new Date();
            return stories.slice(0, num);
        } catch (e) {
            log(`error fetching top stories: ${e.message}`);
            return cachedTopStories;
        }
    } else {
        return cachedTopStories;
    }
}

async function storyData(story_id) {
    if (storyCache[story_id]) {
        return storyCache[story_id];
    }

    try {
        log(`fetching story data for ${story_id}...`);
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${story_id}.json`);
        const data = await response.json();
        storyCache[story_id] = data;
        return data;
    } catch (e) {
        log(`error fetching story data: ${e.message}`);
        return null;
    }
}

async function topStoriesData() {
    const data = [];

    const stories = await topStories();
    for (const story of stories) {
        data.push(await storyData(story));
    }

    return data;
}

module.exports = {
    topStories,
    topStoriesData,
};