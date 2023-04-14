(async function main() {
    const ia = await InfinityArcade.initialize();

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    const prompt_text = params.prompt_text;
    const game = await ia.api.generateGame(prompt_text);
    document.location = `/${game.slug}`;
})();