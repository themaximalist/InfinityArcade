const { DataTypes, Model } = require("sequelize");

const sequelize = require("../sequelize");
const Game = require("./game");

class Art extends Model {
}

Art.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    data: {
        type: DataTypes.BLOB,
        allowNull: false,
    },
}, {
    sequelize,
});

Game.hasOne(Art);
Art.belongsTo(Game);

module.exports = Art;