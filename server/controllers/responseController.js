const { Op } = require("sequelize");
const Response = require("../models/Response");
const LostItem = require("../models/LostItem");

exports.addResponse = async (req, res) => {
  try {
    const { itemId, message } = req.body;

    const item = await LostItem.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const response = await Response.create({
      itemId,
      message,
      responderId: req.user.id,
    });

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getResponses = async (req, res) => {
  try {
    const responses = await Response.findAll({
      where: { itemId: req.params.itemId },
      order: [["createdAt", "DESC"]],
    });

    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyResponses = async (req, res) => {
  try {
    const items = await LostItem.findAll({
      where: { userId: req.user.id },
      attributes: ["id"],
    });

    const ids = items.map((item) => item.id);
    if (ids.length === 0) {
      return res.json([]);
    }

    const responses = await Response.findAll({
      where: { itemId: { [Op.in]: ids } },
      order: [["createdAt", "DESC"]],
    });

    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
