const { DataTypes, Model } = require("sequelize");

const sequelize = require("../sequelize");
const User = require("./user");

class Order extends Model {
}

Order.init({
    stripe_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    client_reference_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customer_details: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
});

Order.belongsTo(User, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });
User.hasOne(Order, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });

module.exports = Order;
