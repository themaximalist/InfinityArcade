const toggleRadio = document.getElementById("radio-toggle");
toggleRadio.onclick = (e) => {
    console.log("CLICK");
    e.preventDefault();

    const player = new Tone.Player({
        url: "https://tonejs.github.io/audio/berklee/gong_1.mp3",
        autoplay: true,
    });

    Tone.loaded().then(() => {
        console.log("LOADED");
        player.start();
    });

};

/*
class Radio {
    constructor() {
        this.autoplay = false;
        this.stopped = false;
        this.playing = false;
        this.index = 0;
        this.synths = [];
        this.songs = [
            "donkey_kong.mid",
            "examples_bach_846.mid",
        ];

        this.toggleRadio = document.getElementById("radio-toggle");
        this.nextRadio = document.getElementById("radio-next");
        this.prevRadio = document.getElementById("radio-prev");
        this.iconPlay = document.getElementById("icon-play");
        this.iconStop = document.getElementById("icon-stop");

        this.toggleRadio.onclick = this.handleToggleRadioClick.bind(this);
        this.nextRadio.onclick = this.handleClickNext.bind(this);
        this.prevRadio.onclick = this.handleClickPrev.bind(this);

        // Listen for the 'stop' event on the Transport
        Tone.Transport.on('stop', async () => {
            if (this.autoplay && this.stopped) {
                console.log("RADIO SONG STOPPED...onto next");
                this.playing = false;
                this.index++;
                await this.play();
                this.render();
            }
        });
    }

    render() {
        if (this.playing) {
            this.iconPlay.style.display = "block";
            this.iconStop.style.display = "none";
        } else {
            this.iconPlay.style.display = "none";
            this.iconStop.style.display = "block";
        }
    }

    getSong() {
        if (this.index >= this.songs.length) {
            this.index = 0;
        }

        if (this.index < 0) {
            this.index = this.songs.length - 1;
        }

        return this.songs[this.index];
    }

    async handleToggleRadioClick(e) {
        e.preventDefault();
        if (this.playing) {
            this.autoplay = false;
            this.stop();
            this.render();
        } else {
            this.autoplay = true;
            await this.play();
            this.render();
        }
    };

    async play() {
        if (this.playing) {
            console.log("ALREADY PLAYING...why are we here???")
            return;
        }

        if (!this.autoplay) {
            console.log("NOT AUTOPLAYING...why are we here???")
            return;
        }

        this.stopped = false;
        this.playing = true;
        const song = this.getSong();
        return new Promise((resolve, reject) => {
            Midi.fromUrl(`/midi/${song}`).then((midi) => {
                console.log("LOADED");
                const now = Tone.now() + 0.5;
                let maxTime = 0; // Variable to store the maximum time value

                midi.tracks.forEach((track) => {
                    // Create a synth for each track
                    const synth = new Tone.PolySynth(10, Tone.Synth, {
                        envelope: {
                            attack: 0.02,
                            decay: 0.1,
                            sustain: 0.3,
                            release: 1,
                        },
                    }).toMaster();

                    this.synths.push(synth);

                    track.notes.forEach((note) => {
                        const startTime = note.time + now;
                        synth.triggerAttackRelease(
                            note.name,
                            note.duration,
                            startTime,
                            note.velocity
                        );
                        // Update maxTime with the end time of each note
                        maxTime = Math.max(maxTime, startTime + note.duration);
                    });
                });

                // Schedule the Transport to stop after the total duration
                Tone.Transport.scheduleOnce((time) => {
                    console.log("SONG ENDED");
                    this.stop();
                }, maxTime);

                Tone.Transport.start();
                resolve();
            });
        });
    }


    stop() {
        this.playing = false;
        while (this.synths.length) {
            const synth = this.synths.shift();
            synth.dispose();
        }
        this.synths = [];
        this.stopped = true;
        Tone.Transport.stop();
    }

    async handleClickNext(e) {
        e.preventDefault();
        this.autoplay = true;
        if (this.playing) {
            this.stop();
        }
        this.index++;
        await this.play();
        this.render();
    }

    async handleClickPrev(e) {
        e.preventDefault();
        this.autoplay = true;
        this.index--;
        if (this.playing) {
            this.stop();
        }
        await this.play();
        this.render();
    }
}


const radio = new Radio();
*/