const { DataTypes, Model } = require("sequelize");

const sequelize = require("../sequelize");
const utils = require("../utils");
const Game = require("./game");

class Chat extends Model {
}

Chat.init({
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    session_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image_prompt_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image_prompt_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
}, {
    sequelize,
});

Chat.belongsTo(Game, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Game.hasMany(Chat, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })


module.exports = Chat;