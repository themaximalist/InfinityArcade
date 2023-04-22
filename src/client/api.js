class InfinityArcadeAPI {
    constructor() {
        if (document.location.href.indexOf("http://localhost:3000") == 0) {
            this.base_url = "http://localhost:3000/api";
        } else if (document.location.href.indexOf("http://192.168.4.103:3000") == 0) {
            this.base_url = "http://192.168.4.103:3000/api";
        } else {
            this.base_url = "https://infinityarcade.com/api";
        }
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
                headers: { accept: 'application/x-ndjson' },
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                body: new URLSearchParams(data)
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async createSession() {
        return await this.fetch(`${this.base_url}/session/new`);
    }

    async saveGame(game) {
        return await this.fetch(`${this.base_url}/game/new`, game);
    }

    async generateGame(prompt_text = null) {
        return await this.fetch(`${this.base_url}/game/generate`, { prompt_text });
    }

    async getArt(slug) {
        return await this.fetch(`${this.base_url}/game/${slug}/art`);
    }

    async *startGame(game, session_id) {
        const response = await this.stream(`${this.base_url}/chat/${game.slug}/start`, { session_id });
        for await (const token of yieldStreamResponse(response)) {
            yield token;
        }
    }

    async *chat(chat_id, content) {
        const response = await this.stream(`${this.base_url}/chat/`, { chat_id, content });
        for await (const token of yieldStreamResponse(response)) {
            yield token;
        }
    }

    async updateAccount(options) {
        return await this.fetch(`${this.base_url}/account`, options);
    }

    async fetchGames(page = 1, limit = 10, params = null) {
        if (!params) params = {};

        const query = Object.assign({}, { page, limit }, params);
        const queryString = Object.keys(query).map(key => key + '=' + query[key]).join('&');

        const url = `${this.base_url}/games?${queryString}`;
        console.log(url);
        return await this.fetch(url);
    }
}

async function* yieldStreamResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    while (true) {
        try {
            const read = await reader.read();
            if (read && !read.done) {
                const raw = decoder.decode(read.value);
                buffer += raw;

                let leftover = "";
                const chunks = buffer.split("\n");
                for (const chunk of chunks) {
                    if (chunk) {
                        // console.log(`'${chunk}'`);
                        try {
                            yield JSON.parse(chunk);
                        } catch (e) {
                            leftover += chunk;
                        }
                    }
                }

                buffer = leftover;
            } else {
                if (buffer) {
                    try {
                        yield JSON.parse(buffer);
                    } catch (e) {
                        console.log("ERROR PARSING LEFTOVER", buffer);
                    }
                }
                break;
            }
        } catch (e) {
            console.log(e);
            console.error(`error while reading stream for ${chat_id}`);
            break;
        }
    }
}

module.exports = InfinityArcadeAPI;