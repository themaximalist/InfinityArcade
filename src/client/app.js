const InfinityArcadeAPI = require('./api');
const InfinityArcadeGame = require('./game');
const UserInterface = require('./ui');
const Radio = require("./radio");
const { getCookie, setCookie } = require('./utils');

class InfinityArcade {
    constructor() {
        this.api = new InfinityArcadeAPI();
        this.ui = new UserInterface();
        this.radio = new Radio();
        this.game = null;
        this.session_id = null;
    }

    sendEvent(name) {
        const event = new CustomEvent(name);
        document.dispatchEvent(event);
    }

    get params() {
        return new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
    }

    async handleGame(game) {
        this.game = new InfinityArcadeGame(this, game);
        await this.game.setup();
    }

    async handleGenerate() {
        const prompt_text = this.params.prompt_text;
        const game = await this.api.generateGame(prompt_text);
        document.location = `/${game.slug}`;
    }

    async handleRadio() {
        this.radio.initialize();
    }

    static async initialize(api) {
        const ia = new InfinityArcade();
        ia.session_id = await ia.getOrCreateSession();
        console.log(`initialized InfinityArcade with session_id ${ia.session_id}`);
        return ia;
    }

    async getOrCreateSession() {
        let session_id = getCookie("ia_session_id");
        if (!session_id) {
            session_id = await this.api.createSession();
            setCookie("ia_session_id", session_id);
        }

        if (!session_id) {
            throw "Error: Could not create session";
        }

        return session_id;
    }
}

module.exports = InfinityArcade;