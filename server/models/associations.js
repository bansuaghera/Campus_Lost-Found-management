const User = require("./User");
const LostItem = require("./LostItem");
const Response = require("./Response");

let initialized = false;

const setupAssociations = () => {
  if (initialized) {
    return;
  }

  User.hasMany(LostItem, { foreignKey: "userId", as: "items" });
  LostItem.belongsTo(User, { foreignKey: "userId", as: "owner" });

  User.hasMany(Response, { foreignKey: "responderId", as: "responses" });
  Response.belongsTo(User, { foreignKey: "responderId", as: "responder" });

  LostItem.hasMany(Response, { foreignKey: "itemId", as: "responses" });
  Response.belongsTo(LostItem, { foreignKey: "itemId", as: "item" });

  initialized = true;
};

module.exports = setupAssociations;
