class UserInterface {
    constructor() {
        this.videogame = document.getElementById("videogame");
        this.image = document.getElementById("image");
        this.tagline = document.getElementById("tagline");
        this.genre_wrapper = document.getElementById("genre-wrapper");
        this.image_loader = document.getElementById("image-loader");
        this.image_wrapper = document.getElementById("image-wrapper");
        this.dot_loader = document.getElementById("dot-loader");
        this.text = document.getElementById("text");
        this.chat = document.getElementById("chat");
        this.chat_form = document.getElementById("chat-form");
        this.chat_input = document.getElementById("chat-input");
        this.scrollend = document.getElementById("scrollend");

        this.option1 = document.getElementById("option1");
        this.button1 = document.getElementById("button1");
        this.option2 = document.getElementById("option2");
        this.button2 = document.getElementById("button2");
        this.option3 = document.getElementById("option3");
        this.button3 = document.getElementById("button3");
        this.option4 = document.getElementById("option4");
        this.button4 = document.getElementById("button4");

        this.chat_containers = {};

        this.loading = false;
    }

    setText(content) {
        this.text.innerHTML = content;
        this.text.style.display = "flex";
    }

    getChatContainer(chat_id) {
        if (this.chat_containers[chat_id]) {
            return this.chat_containers[chat_id];
        }

        console.log("Creating chat container");
        const container = document.createElement("div");
        container.id = `chat-${chat_id}`;
        this.text.appendChild(container);
        this.chat_containers[chat_id] = container;
        return container;
    }

    addTextToChat(content, chat_id) {
        const container = this.getChatContainer(chat_id);
        container.innerHTML += content;
        return container;
    }

    addOptionText(option, content) {
        if (option == "option1") {
            this.option1.style.display = "block";
            this.button1.innerHTML += content;
        } else if (option == "option2") {
            this.option2.style.display = "block";
            this.button2.innerHTML += content;
        } else if (option == "option3") {
            this.option3.style.display = "block";
            this.button3.innerHTML += content;
        } else if (option == "option4") {
            this.option4.style.display = "block";
            this.button4.innerHTML += content;
        }
    }

    addSceneImage(chat_id) {
        const sceneImage = document.createElement('img');
        sceneImage.src = `/api/art/generate?chat_id=${chat_id}`;
        this.image_wrapper.insertBefore(sceneImage, this.image_wrapper.firstChild);
    }

    showChatInput() {
        this.chat.style.display = "flex";
        this.chat_input.focus();
    }

    imageLoaded() {
        return this.image && this.image.complete;
    }

    showDotLoader() {
        this.dot_loader.style.display = "block";
    }

    hideDotLoader() {
        this.dot_loader.style.display = "none";
    }

    hideImageLoader() {
        this.image_loader.style.display = "none";
    }

    showImageLoader() {
        this.image_loader.style.display = "block";
    }

    reset() {
        // this.text.innerHTML += "<br /><br />"
        this.resetOptions();
        this.resetChat();
        this.showDotLoader();
    }

    resetText() {
        this.setText("");
        this.text.scrollTop = 0;
    }

    resetChat() {
        this.chat.style.display = "none";
        this.chat_input.value = "";
    }

    resetOptions() {
        this.button1.innerHTML = "";
        this.button2.innerHTML = "";
        this.button3.innerHTML = "";
        this.button4.innerHTML = "";
        this.option1.style.opacity = 1; // mobile hover bug
        this.option2.style.opacity = 1;
        this.option3.style.opacity = 1;
        this.option4.style.opacity = 1;
        this.option1.style.display = "none";
        this.option2.style.display = "none";
        this.option3.style.display = "none";
        this.option4.style.display = "none";
    }

    enableGameUI() {
        const footer = document.getElementById("footer");
        if (footer) {
            footer.style.display = "none";
        }

        this.videogame.classList.add("ia-game-started");
        this.startLoading();
    }

    startLoading() {
        this.loading = true;
        this.reset();
    }

    stopLoading() {
        this.loading = false;
        this.hideDotLoader();
    }

}

module.exports = UserInterface;