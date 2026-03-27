const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Response = sequelize.define("Response", {
  message: DataTypes.TEXT,
  itemId: DataTypes.INTEGER,
  responderId: DataTypes.INTEGER,
});

module.exports = Response;
