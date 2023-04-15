class Radio {
    constructor() {
        this.audio = null;
        this.autoplay = true;
        this.index = 0;
        this.catalog = [
            "CHIPTUNE_Minstrel_Dance.mp3",
            "CHIPTUNE_The_Bards_Tale.mp3",
            "CHIPTUNE_The_Old_Tower_Inn.mp3",
            "HinaCC0_011_Fallen_leaves.mp3",
            "Komiku_-_02_-_Boss_4__Cobblestone_in_their_face.mp3",
            "Komiku_-_02_-_Poupis_Theme.mp3",
            "Komiku_-_04_-_Shopping_List.mp3",
            "Komiku_-_07_-_Last_Boss__Lets_see_what_we_got.mp3",
            "Loyalty_Freak_Music_-_02_-_High_Technologic_Beat_Explosion.mp3",
            "Loyalty_Freak_Music_-_04_-_Cant_Stop_My_Feet_.mp3",
            "Loyalty_Freak_Music_-_04_-_It_feels_good_to_be_alive_too.mp3",
            "draft-monk-ambience.mp3",
            "ocean-of-ice.mp3",
            "雪のテーマ-Snow-field-.mp3",
        ]
    }

    initialize() {
        console.log("INITIALIZE RADIO");

        this.toggleRadio = document.getElementById("radio-toggle");
        this.nextRadio = document.getElementById("radio-next");
        this.prevRadio = document.getElementById("radio-prev");
        this.iconPlay = document.getElementById("icon-play");
        this.iconStop = document.getElementById("icon-stop");

        this.toggleRadio.onclick = this.handleToggleRadioClick.bind(this);
        this.nextRadio.onclick = this.handleClickNext.bind(this);
        this.prevRadio.onclick = this.handleClickPrev.bind(this);
    }

    handleToggleRadioClick(e) {
        e.preventDefault();

        if (this.audio) {
            this.stop();
        } else {
            this.play();
        }
    }

    handleClickNext(e) {
        e.preventDefault();
        this.next();
    }

    handleClickPrev(e) {
        e.preventDefault();
        this.prev();
    }

    songEnded() {
        console.log("SONG ENDED");
        this.audio = null;
        if (this.autoplay) {
            this.next();
        }
    }

    get song() {
        if (this.index >= this.catalog.length) {
            this.index = 0;
        }

        if (this.index < 0) {
            this.index = this.catalog.length - 1;
        }

        return this.catalog[this.index];
    }

    play() {
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }

        console.log(`PLAYING ${this.song}`);

        this.audio = new Audio(`/mp3/${this.song}`);
        this.audio.volume = 0.2;

        this.audio.addEventListener('ended', this.songEnded.bind(this));

        this.audio.play();

        this.render();
    }

    stop() {
        if (this.audio) {
            console.log("STOPPING");
            this.audio.pause();
            this.audio = null;
            this.render();
        }
    }

    next() {
        this.index++;
        this.play();
    }

    prev() {
        this.index--;
        this.play();
    }

    render() {
        if (this.audio) {
            this.iconPlay.style.display = "block";
            this.iconStop.style.display = "none";
        } else {
            this.iconPlay.style.display = "none";
            this.iconStop.style.display = "block";
        }
    }
}


module.exports = Radio;
