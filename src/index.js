require("dotenv").config();
const log = require("debug")("ia:index");

const Database = require("./database");
const Server = require("./server");

async function main() {
    await Database.initialize();
    const server = new Server();
    server.start();
}

main();