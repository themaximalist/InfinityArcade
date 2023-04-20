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
    return str.startsWith("http://") || str.startsWith("https://");
}

module.exports = {
    slugify,
    rand,
    shuffle,
    relativeTime,
    isURL,
};