const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const LostItem = sequelize.define("LostItem", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  location: DataTypes.STRING,
  contact: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: "Lost",
  },
  userId: DataTypes.INTEGER,
});

module.exports = LostItem;
