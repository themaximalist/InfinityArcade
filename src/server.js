const log = require("debug")("ia:server");

const express = require("express");
const controllers = require("./controllers");

class Server {
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static("public"));
        this.app.set("view engine", "ejs");
        this.app.set("views", "src/views");


        this.setupHandlers();
    }

    setupHandlers() {
        this.app.get("/api/session/new", controllers.sessions.create);

        this.app.post("/api/game/new", controllers.games.create);
        this.app.post("/api/game/generate", controllers.games.generate);
        this.app.get("/api/art/generate", controllers.art.generate);

        // this.app.get("/api/game/:slug/art", controllers.art.get);
        this.app.post("/api/chat/:slug/start", controllers.chats.start);
        this.app.post("/api/chat", controllers.chats.chat);

        this.app.get("/generate", controllers.games.generate_handler);
        this.app.get("/", controllers.games.index); // TODO: switch to infinity game view 

        this.app.get("/:slug", controllers.games.wildcard_handler);

        // this.app.get("/", handlers.createSession);           // home page
        // this.app.get("/create", handlers.createSession);     // game creator
        // this.app.get("/:game_slug", handlers.createSession); // search engine

        // INDEX
        // GAME INDEX
        // GAME CREATOR
    }

    start() {
        const PORT = process.env.PORT || 3000;
        this.app.listen(PORT, () => {
            log(`Server is running on port ${PORT}`);
        });
    }
}

module.exports = Server;
