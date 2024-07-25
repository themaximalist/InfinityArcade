const { DataTypes, Model } = require("sequelize");

const sequelize = require("../sequelize");
const utils = require("../utils");
const User = require("./user");

class Game extends Model {
}

Game.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tagline: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subgenre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    primary_color: {
        type: DataTypes.STRING,
        allowNull: true
    },
    prompt_name: {
        type: DataTypes.STRING,
        defaultValue: "UGC",
        allowNull: false,
    },
    prompt_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    prompt_model: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "gpt-4o-mini"
    },
    image_prompt_model: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image_prompt_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image_prompt_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image_data: {
        type: DataTypes.BLOB,
        allowNull: true,
    },
    music_prompt_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    music_prompt_seed_image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    private: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    llm_fields: {
        type: DataTypes.VIRTUAL,
        get() {
            return {
                title: this.getDataValue("title"),
                description: this.getDataValue("description"),
                genre: this.getDataValue("genre"),
                subgenre: this.getDataValue("subgenre"),
                tagline: this.getDataValue("tagline"),
                primary_color: this.getDataValue("primary_color"),
            };
        },
        set() {
            throw new Error('Do not try to set the `llm_fields` value!');
        }
    }
}, {
    sequelize,
});

const create = Game.create.bind(Game);
Game.create = async function (game) {
    try {
        if (!game.slug) {
            game.slug = utils.slugify(game.title);
        }

        return await create(game);
    } catch (e) {
        if (e.name !== "SequelizeUniqueConstraintError") return e;
        if (e.errors.length !== 1) return e;
        if (e.errors[0].type !== "unique violation") return e;
        if (e.errors[0].path !== "slug") return e;

        // DUPLICATE SLUG...fix and try to save again
        game.slug = utils.slugify(`${game.title} ${utils.rand()}`);
        return await create(game);
    }
}

Game.belongsTo(User, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' })
User.hasMany(Game, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' })

module.exports = Game;