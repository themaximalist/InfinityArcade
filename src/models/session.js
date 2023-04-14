const { DataTypes, Model } = require("sequelize");

const sequelize = require("../sequelize");

class Session extends Model { }

Session.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
}, {
    sequelize,
});

module.exports = Session;