const log = require("debug")("ia:services:images");

const Replicate = require("replicate");
const fetch = require("node-fetch");
const utils = require("../utils");
const fs = require("fs");

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,
    fetch: require("node-fetch"),
});

async function replicate2image(prompt_text) {
    try {
        if (!process.env.REPLICATE_API_KEY) throw new Error("Missing REPLICATE_API_KEY");

        log(`hitting replicate API`);
        const output = await replicate.run(
            "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
            {
                input: {
                    image_dimensions: "512x512",
                    scheduler: "K_EULER",
                    num_outputs: 1,
                    prompt: prompt_text,
                }
            }
        );

        const remote_image_url = output[0];
        log(`generated replicate2image ${remote_image_url}...`);

        const response = await fetch(remote_image_url);
        return await response.buffer();
    } catch (e) {
        log(`error running replicate2image: ${e}`);
        return null;
    }
}

async function stability2image(prompt_text, model = "stable-diffusion-xl-beta-v2-2-2") {
    try {
        if (!process.env.STABILITY_API_KEY) throw new Error("Missing STABILITY_API_KEY");
        log(`hitting stability API`);

        const BASE_URL = "https://api.stability.ai";

        const response = await fetch(
            `${BASE_URL}/v1/generation/${model}/text-to-image`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
                },
                body: JSON.stringify({
                    text_prompts: [{ text: prompt_text }],
                    cfg_scale: 7,
                    clip_guidance_preset: 'FAST_BLUE',
                    height: 512,
                    width: 512,
                    samples: 1,
                    sampler: "K_EULER",
                    steps: 50,
                }),
            }
        )

        if (!response.ok) {
            throw new Error(`invalid response: ${await response.text()}`)
        }

        const data = await response.json();
        if (!data || data.artifacts.length !== 1) {
            throw new Error(`invalid response: ${data}`);
        }

        const image = data.artifacts[0];

        return Buffer.from(image.base64, 'base64')
    } catch (e) {
        log(`error running stability2image: ${e}`);
        return null;
    }
}

module.exports = { replicate2image, stability2image };