const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Item = sequelize.define(
  "Item",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    location: {
      type: DataTypes.STRING,
    },
    contact: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Item;
