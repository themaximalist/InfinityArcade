const log = require("debug")("ia:services:images");

const Replicate = require("replicate");

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,
    fetch: require("node-fetch"),
});

async function stablediffusion(prompt) {
    try {
        log(`hitting replicate API`);
        const output = await replicate.run(
            "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
            {
                input: {
                    image_dimensions: "512x512",
                    scheduler: "K_EULER",
                    num_outputs: 1,
                    prompt,
                }
            }
        );

        return output[0];
    } catch (e) {
        log(`error running stablediffusion: ${e}`);
        return null;
    }
}

module.exports = { stablediffusion };