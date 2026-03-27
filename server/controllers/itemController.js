const LostItem = require("../models/LostItem");

// Add item
exports.addItem = async (req, res) => {
  const item = await LostItem.create({
    ...req.body,
    userId: req.user.id,
  });
  res.json(item);
};

// Get all items
exports.getItems = async (req, res) => {
  const items = await LostItem.findAll();
  res.json(items);
};

// Get single item
exports.getItem = async (req, res) => {
  const item = await LostItem.findByPk(req.params.id);
  res.json(item);
};

// My items
exports.getMyItems = async (req, res) => {
  const items = await LostItem.findAll({
    where: { userId: req.user.id },
  });
  res.json(items);
};

// Update status 🔥
exports.updateStatus = async (req, res) => {
  await LostItem.update(
    { status: req.body.status },
    { where: { id: req.params.id } },
  );
  res.json({ msg: "Status Updated" });
};
