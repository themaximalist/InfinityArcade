class Radio {

    constructor(api) {
        this.api = api;
        this.game_id = null;
        this.music = null;
        this.radio = document.getElementById("radio");
    }

    initialize(game_id) {
        console.log("INITIALIZE RADIO");
        this.game_id = game_id;
    }

    injectRadio(music) {
        const url = `https://riffusion.infinityarcade.com/?prompt=${encodeURIComponent(music.prompt)}&seedImageId=${music.seedImageId}`;
        const html = `<iframe id="radio-frame" src="${url}" class="aspect-square w-7"></iframe>`;
        this.radio.innerHTML = html;
    }

    async generatePrompt() {
        if (!this.game_id) throw new Error("No Game ID");

        console.log("Generating Radio Prompt");
        return await this.api.generateRadioPrompt(this.game_id);
    }

}


module.exports = Radio;
