const { Op } = require("sequelize");
const Response = require("../models/Response");
const LostItem = require("../models/LostItem");
const User = require("../models/User");

const responseInclude = [
  {
    model: User,
    as: "responder",
    attributes: ["id", "name", "email"],
  },
];

exports.addResponse = async (req, res) => {
  try {
    const { itemId, message } = req.body;

    const item = await LostItem.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (!message?.trim()) {
      return res.status(400).json({ message: "A response message is required" });
    }

    if (item.userId === req.user.id) {
      return res.status(400).json({ message: "You cannot respond to your own item" });
    }

    const response = await Response.create({
      itemId,
      message: message.trim(),
      responderId: req.user.id,
    });

    const createdResponse = await Response.findByPk(response.id, {
      include: responseInclude,
    });

    res.status(201).json(createdResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getResponses = async (req, res) => {
  try {
    const responses = await Response.findAll({
      where: { itemId: req.params.itemId },
      include: responseInclude,
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
      include: [
        ...responseInclude,
        {
          model: LostItem,
          as: "item",
          attributes: ["id", "title", "status", "category"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
