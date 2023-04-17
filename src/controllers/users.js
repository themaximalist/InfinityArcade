const log = require("debug")("ia:controllers:users");
const bcrypt = require("bcrypt");
const User = require("../models/user");

async function login(req, res) {
    res.render("login");
}

async function logout(req, res) {
    res.clearCookie("userId");
    res.redirect("/");
}

function isPasswordValid(password) {
    return password.length >= 8;
}

async function handle_login(req, res) {
    try {
        if (!isPasswordValid(req.body.password)) {
            throw new Error("Password must be at least 8 characters");
        }

        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            throw new Error("Email not found");
        }

        const isValid = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!isValid) {
            throw new Error("Incorrect password");
        }

        // Set the user ID as a signed cookie
        res.cookie("userId", user.id, { signed: true, httpOnly: true });

        res.redirect("/account");
    } catch (error) {
        res.render("login", { error: error.message });
    }
}

async function account(req, res) {
    res.render("account", { user: req.user });
}

async function signup(req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log(hashedPassword);
        await User.create({
            email: req.body.email,
            password: hashedPassword,
        });
        res.status(201).send("User created");
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
}

const ALLOWED_UPDATE_KEYS = ["model", "private"];
const ALLOWED_MODELS = ["gpt-4", "gpt-3.5-turbo"];
async function account_update(req, res) {
    try {
        const update = req.body;

        for (const key in update) {
            if (!ALLOWED_UPDATE_KEYS.includes(key)) {
                throw new Error("Invalid update key");
            }
        }

        if (update.model) {
            if (!ALLOWED_MODELS.includes(update.model)) {
                throw new Error("Invalid model");
            }
        }

        const saved = await User.update(update, {
            where: {
                id: req.user.id,
            },
        });

        if (!saved) {
            throw new Error("Error updating account");
        }

        return res.json({
            status: "success",
            data: true,
        });
    } catch (e) {
        return res.json({
            status: "error",
            message: `Error updating account: ${e.message}`,
        });
    }
}

module.exports = {
    login,
    signup,
    handle_login,
    account,
    account_update,
    logout,
};