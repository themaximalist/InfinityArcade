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
    private: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "gpt-4"
    },
    admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    sequelize,
});


module.exports = User;