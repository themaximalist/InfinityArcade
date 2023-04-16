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
            return res.status(400).send("Password must be at least 8 characters");
        }

        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res.status(400).send("Email not found");
        }

        const isValid = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!isValid) {
            return res.status(400).send("Incorrect password");
        }

        // Set the user ID as a signed cookie
        res.cookie("userId", user.id, { signed: true, httpOnly: true });

        res.redirect("/account");
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
}

async function account(req, res) {
    console.log(req.user);
    res.send("ACCOUNT");
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

module.exports = {
    login,
    signup,
    handle_login,
    account,
    logout,
};