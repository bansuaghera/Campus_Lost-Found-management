const Item = require("../models/Item");
const { Op } = require("sequelize");

// ➕ Add Item
exports.addItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📄 Get All Items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get Single Item
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔎 Search Items
exports.searchItems = async (req, res) => {
  try {
    const { query } = req.query;
    const normalizedQuery = query?.trim();

    if (!normalizedQuery) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const items = await Item.findAll({
      where: {
        title: {
          [Op.iLike]: `%${normalizedQuery}%`,
        },
      },
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
