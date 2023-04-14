const slugifyjs = require("slugify");
const uuid = require("uuid");
const { readFileSync } = require("fs");

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

module.exports = {
    slugify,
    rand,
    shuffle,
};