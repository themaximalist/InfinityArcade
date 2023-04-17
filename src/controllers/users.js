const log = require("debug")("ia:controllers:users");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Chat = require("../models/chat");
const Game = require("../models/game");
const sequelize = require("../sequelize");
const utils = require("../utils");
const Order = require("../models/order");


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
    const games = await req.user.getGames();
    const chats = (await Chat.findAll({
        where: {
            UserId: req.user.id,
            parent_id: null,
        },
        include: [
            {
                model: Game,
                required: true
            }
        ],
        attributes: {
            include: [
                [
                    sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM "Chats" AS "childChats"
                    WHERE "childChats"."parent_id" = "Chat"."id"
                )`),
                    'childCount',
                ],
                [
                    sequelize.literal(`(
                    SELECT MAX("childChats"."createdAt")
                    FROM "Chats" AS "childChats"
                    WHERE "childChats"."parent_id" = "Chat"."id"
                )`),
                    'mostRecentChatDate',
                ],
                [
                    sequelize.literal(`(
                    SELECT "childChats"."id"
                    FROM "Chats" AS "childChats"
                    WHERE "childChats"."parent_id" = "Chat"."id"
                    ORDER BY "childChats"."createdAt" DESC
                    LIMIT 1
                )`),
                    'mostRecentChatId',
                ],
            ],
        },
        order: [
            ["createdAt", "DESC"]
        ],
    })).map(chat => {
        chat.dataValues.relativeTime = utils.relativeTime(chat.dataValues.mostRecentChatDate);
        return chat;
    });

    console.log(chats);

    res.render("account", {
        user: req.user,
        games,
        chats,
    });
}

async function signup(req, res) {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.render("signup");
        }

        const order = await Order.findOne({
            where: {
                client_reference_id: session_id,
                UserId: null,
            }
        });

        if (!order) throw new Error("Couldn't find an order for this session. If you just purchased please wait a minute and try again, or contact hello@themaximalist.com");

        return res.render("signup", {
            session_id,
            order,
        });
    } catch (e) {
        return res.render("signup", {
            error: e.message,
        });
    }
}

async function handle_signup(req, res) {
    try {
        const { email, password, session_id, order_id } = req.body;
        if (!email || !password || !session_id || !order_id) throw new Error("Missing required fields");

        const order = await Order.findOne({
            where: {
                client_reference_id: session_id,
                UserId: null,
            }
        });

        if (!order) throw new Error("Couldn't find an order for this session. If you just purchased please wait a minute and try again, or contact hello@themaximalist.com");
        if (Number(order_id) != order.id) throw new Error("Invalid order id");

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
        });
        if (!user) throw new Error("Error creating user");

        const updatedOrder = await Order.update({
            UserId: user.id,
        }, {
            where: {
                id: order.id,
            }
        });
        if (!updatedOrder) throw new Error("Error updating order");

        // Set the user ID as a signed cookie
        res.cookie("userId", user.id, { signed: true, httpOnly: true });

        return res.redirect("/account");
    } catch (e) {
        res.render("signup", { error: e.message });
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
    handle_signup,
    account,
    account_update,
    logout,
};