class InfinityArcade {
    constructor() {
        this.api = new InfinityArcadeAPI();
        this.session_id = null;
    }

    static async initialize() {
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