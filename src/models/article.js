const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");

class Article extends Model {}

Article.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Article',
});

module.exports = Article;
