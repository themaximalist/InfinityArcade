class InfinityArcadeAPI {
    BASE_URL = "https://infinityarcade.com/api";
    // BASE_URL = "http://localhost:3000/api";

    constructor() {

    }

    async fetch(url, data = null) {
        console.log(`fetching ${url}...`);
        try {
            let response;

            if (data) {
                response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
            } else {
                response = await fetch(url);
            }

            const envelope = await response.json();
            if (envelope.status !== "success") {
                throw envelope.message;
            }

            return envelope.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async stream(url, data = null) {
        console.log(`streaming ${url}...`);
        try {
            if (!data) {
                return this.fetch(url);
            }

            return fetch(url, {
                method: "POST",
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                body: new URLSearchParams(data)
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async createSession() {
        return await this.fetch(`${this.BASE_URL}/session/new`);
    }

    async saveGame(game) {
        return await this.fetch(`${this.BASE_URL}/game/new`, game);
    }

    async generateGame(prompt_text = null) {
        return await this.fetch(`${this.BASE_URL}/game/generate`, { prompt_text });
    }

    async getArt(slug) {
        return await this.fetch(`${this.BASE_URL}/game/${slug}/art`);
    }

    async *startGame(game, session_id) {
        const response = await this.stream(`${this.BASE_URL}/chat/${game.slug}/start`, { session_id });
        for await (const token of yieldStreamResponse(response)) {
            yield token;
        }
    }

    async *chat(chat_id, content) {
        const response = await this.stream(`${this.BASE_URL}/chat/`, { chat_id, content });
        for await (const token of yieldStreamResponse(response)) {
            yield token;
        }
    }
}

async function* yieldStreamResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        try {
            const read = await reader.read();
            if (read && !read.done) {
                const chunk = decoder.decode(read.value).trim();
                const chunks = chunk.split("\n");
                for (const c of chunks) {
                    console.log(c);
                    yield JSON.parse(c);
                }
            } else {
                break;
            }
        } catch (e) {
            console.log(e);
            console.error(`error while reading stream for ${chat_id}`);
            break;
        }
    }
}