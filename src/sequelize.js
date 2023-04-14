const log = require("debug")("ia:sequelize");
const { Sequelize } = require("sequelize");
module.exports = new Sequelize(process.env.DATABASE_URI);