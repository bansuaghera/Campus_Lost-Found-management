const { Op } = require("sequelize");
const LostItem = require("../models/LostItem");
const Response = require("../models/Response");
const User = require("../models/User");
const { sendLostItemBroadcast } = require("../services/lostItemNotificationService");

const VALID_STATUSES = ["Lost", "Found", "Claimed", "Resolved"];
const VALID_REPORT_TYPES = ["Lost", "Found"];

const itemInclude = [
  {
    model: User,
    as: "owner",
    attributes: ["id", "name", "email"],
  },
  {
    model: Response,
    as: "responses",
    attributes: ["id", "claimStatus"],
  },
];

const buildItemPayload = (body = {}) => {
  const reportType = VALID_REPORT_TYPES.includes(body.reportType) ? body.reportType : "Lost";
  const status = VALID_STATUSES.includes(body.status) ? body.status : reportType;

  return {
    title: body.title?.trim(),
    description: body.description?.trim() || "",
    category: body.category?.trim() || "Other",
    location: body.location?.trim() || "",
    contact: body.contact?.trim() || "",
    reportType,
    status,
    reportedAt: body.reportedAt || new Date().toISOString().slice(0, 10),
  };
};

const buildFilters = (query = {}) => {
  const where = {};
  const normalizedQuery = query.query?.trim() || query.q?.trim();

  if (normalizedQuery) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${normalizedQuery}%` } },
      { description: { [Op.iLike]: `%${normalizedQuery}%` } },
      { location: { [Op.iLike]: `%${normalizedQuery}%` } },
      { contact: { [Op.iLike]: `%${normalizedQuery}%` } },
      { category: { [Op.iLike]: `%${normalizedQuery}%` } },
    ];
  }

  if (VALID_STATUSES.includes(query.status)) {
    where.status = query.status;
  }

  if (VALID_REPORT_TYPES.includes(query.reportType)) {
    where.reportType = query.reportType;
  }

  if (query.category?.trim()) {
    where.category = query.category.trim();
  }

  if (query.location?.trim()) {
    where.location = { [Op.iLike]: `%${query.location.trim()}%` };
  }

  return where;
};

exports.addItem = async (req, res) => {
  try {
    const payload = buildItemPayload(req.body);

    if (!payload.title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const item = await LostItem.create({
      ...payload,
      userId: req.user.id,
    });

    const createdItem = await LostItem.findByPk(item.id, {
      include: itemInclude,
    });

    if (createdItem.reportType === "Lost") {
      try {
        await sendLostItemBroadcast(createdItem);
      } catch (mailError) {
        console.error("Lost item notification failed:", mailError.message);
      }
    }

    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await LostItem.findAll({
      where: buildFilters(req.query),
      include: itemInclude,
      order: [["createdAt", "DESC"]],
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItem = async (req, res) => {
  try {
    const item = await LostItem.findByPk(req.params.id, {
      include: itemInclude,
    });

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
      include: itemInclude,
      order: [["createdAt", "DESC"]],
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchItems = async (req, res) => {
  try {
    const normalizedQuery = req.query.query?.trim() || req.query.q?.trim();

    if (!normalizedQuery) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const items = await LostItem.findAll({
      where: buildFilters({ ...req.query, query: normalizedQuery }),
      include: itemInclude,
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

    if (!VALID_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    item.status = req.body.status;
    await item.save();

    const updatedItem = await LostItem.findByPk(req.params.id, {
      include: itemInclude,
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await LostItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.userId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed to update this item" });
    }

    const payload = buildItemPayload({
      ...item.toJSON(),
      ...req.body,
      status: req.body.status || item.status,
    });

    if (!payload.title) {
      return res.status(400).json({ message: "Title is required" });
    }

    await item.update(payload);

    const updatedItem = await LostItem.findByPk(req.params.id, {
      include: itemInclude,
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
