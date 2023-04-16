const { DataTypes, Model } = require("sequelize");

const sequelize = require("../sequelize");

class User extends Model {
}

User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
});


module.exports = User;