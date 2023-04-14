const slugifyjs = require("slugify");
const uuid = require("uuid");
const { readFileSync } = require("fs");

const request = require("request");
const fs = require("fs");

function slugify(input) {
    return slugifyjs(input, {
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        strict: false,
    });
}

function streamToDisk(remote_url, file_path) {

    return new Promise((resolve, reject) => {
        const write_stream = fs.createWriteStream(file_path);

        request(remote_url)
            .pipe(write_stream)
            .on('finish', () => {
                write_stream.end();

                if (fs.existsSync(file_path)) {
                    resolve();
                } else {
                    reject(new Error(`file not written to disk`));
                }
            })
            .on('error', (error) => {
                fs.unlink(file_path, () => { });
                reject(error);
            });
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

function genres(num = 20) {
    return shuffle(readFileSync("./data/genres.txt", "utf8").trim().split("\n")).slice(0, num).join("\n");
}

module.exports = {
    slugify,
    rand,
    shuffle,
    genres,
    streamToDisk,
};