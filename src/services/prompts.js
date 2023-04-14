const log = require("debug")("ia:services:prompts");

const { readFileSync, existsSync } = require("fs");
const ejs = require("ejs");
const TOML = require("toml");

function parse(path, variables) {
    const content = readFileSync(path, "utf8").trim();
    return ejs.render(content, variables);
}

function load(promptName, variables) {
    let path;

    path = `./data/prompts/${promptName}.txt`;
    if (existsSync(path)) {
        return parse(path, variables);
    }

    path = `./data/prompts/${promptName}.toml`;
    if (existsSync(path)) {
        const data = parse(path, variables);
        return TOML.parse(data).messages;
    }

    return null;
}

module.exports = { load };
