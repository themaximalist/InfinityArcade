require("dotenv").config();

const log = require("debug")("ia:server");

const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const Database = require("./database");
const controllers = require("./controllers");
const { verify_user, optional_user, verify_admin } = require("./middleware");

class Server {
    constructor() {
        if (!process.env.COOKIE_SECRET) throw new Error("COOKIE_SECRET not set");
        this.app = express();

        this.setupBufferHandlers();
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser(process.env.COOKIE_SECRET));
        this.app.use(express.static("public"));
        this.app.locals = {
            NODE_ENV: process.env.NODE_ENV,
            SITE_URL: process.env.SITE_URL,
        };
        this.app.set("view engine", "ejs");
        this.app.set("views", "src/views");
        this.setupHandlers();
    }

    setupBufferHandlers() {
        this.app.post("/webhook", bodyParser.raw({ type: 'application/json' }), controllers.orders.webhook);
    }

    setupHandlers() {
        this.app.get("/status", controllers.status);

        this.app.get("/api/session/new", controllers.sessions.create);
        this.app.post("/api/game/new", controllers.games.create);
        this.app.post("/api/game/generate", optional_user, controllers.games.generate);
        this.app.get("/api/game/:slug/art", controllers.art.get);
        this.app.get("/api/art/generate", optional_user, controllers.art.generate);
        this.app.post("/api/chat/:slug/start", optional_user, controllers.chats.start);
        this.app.post("/api/chat", optional_user, controllers.chats.chat);
        this.app.post("/api/account", verify_user, controllers.users.account_update);

        this.app.get("/login", controllers.users.login);
        this.app.post("/login", controllers.users.handle_login);
        this.app.get("/logout", controllers.users.logout);
        this.app.get("/signup", controllers.users.signup);
        this.app.post("/signup", controllers.users.handle_signup);
        this.app.get("/account", verify_user, controllers.users.account);
        this.app.get("/pro", controllers.pro.index);

        this.app.get("/admin", verify_user, verify_admin, controllers.admin.index);

        this.app.get("/generate", optional_user, controllers.games.generate_handler);
        this.app.get("/", optional_user, controllers.games.index);
        this.app.get("/*", optional_user, controllers.games.wildcard_handler);
    }

    start() {
        const PORT = process.env.PORT || 3000;
        this.app.listen(PORT, () => {
            log(`Server is running on port ${PORT}`);
        });
    }
}

(async function main() {
    await Database.initialize();
    const server = new Server();
    server.start();
})();