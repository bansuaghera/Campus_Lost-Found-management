const { Op } = require("sequelize");
const LostItem = require("../models/LostItem");

exports.addItem = async (req, res) => {
  try {
    const item = await LostItem.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await LostItem.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItem = async (req, res) => {
  try {
    const item = await LostItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyItems = async (req, res) => {
  try {
    const items = await LostItem.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchItems = async (req, res) => {
  try {
    const normalizedQuery = req.query.query?.trim();

    if (!normalizedQuery) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const items = await LostItem.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${normalizedQuery}%` } },
          { description: { [Op.iLike]: `%${normalizedQuery}%` } },
          { location: { [Op.iLike]: `%${normalizedQuery}%` } },
          { contact: { [Op.iLike]: `%${normalizedQuery}%` } },
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const item = await LostItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.userId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed to update this item" });
    }

    item.status = req.body.status || item.status;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
