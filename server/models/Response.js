const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Response = sequelize.define("Response", {
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  claimStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Pending",
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  responderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Response;
