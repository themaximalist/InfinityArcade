const slugifyjs = require("slugify");
const uuid = require("uuid");

const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en");
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

function slugify(input) {
    return slugifyjs(input, {
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        strict: false,
    });
}

// https://github.com/danny-wood/unslugify
const unslugify = (slug) => slug.replace(/\-/g, " ")
    .replace(/\w\S*/g,
        (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    );

function unslugify2(slug) {
    return slug.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("-");
}

function rand() {
    return uuid.v4().split("-")[0].toLowerCase();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function relativeTime(date) {
    return timeAgo.format(date);
}

function isURL(str) {
    if (!str || typeof str !== "string") return false;
    return str.indexOf("http://") == 0 || str.indexOf("https://") == 0;
}

module.exports = {
    slugify,
    unslugify,
    unslugify2,
    rand,
    shuffle,
    relativeTime,
    isURL,
};