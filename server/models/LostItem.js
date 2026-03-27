const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const LostItem = sequelize.define("LostItem", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Other",
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  contact: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  reportType: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Lost",
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Lost",
  },
  reportedAt: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = LostItem;
