const Response = require("../models/Response");
const LostItem = require("../models/LostItem");

// Add response
exports.addResponse = async (req, res) => {
  const { itemId, message } = req.body;

  const response = await Response.create({
    itemId,
    message,
    responderId: req.user.id,
  });

  res.json(response);
};

// Get responses of item
exports.getResponses = async (req, res) => {
  const responses = await Response.findAll({
    where: { itemId: req.params.itemId },
  });
  res.json(responses);
};

// Responses on my items
exports.getMyResponses = async (req, res) => {
  const items = await LostItem.findAll({
    where: { userId: req.user.id },
  });

  const ids = items.map((i) => i.id);

  const responses = await Response.findAll({
    where: { itemId: ids },
  });

  res.json(responses);
};
