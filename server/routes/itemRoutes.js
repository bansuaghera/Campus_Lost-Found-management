const express = require("express");
const router = express.Router();

const {
  addItem,
  getItems,
  getItemById,
  searchItems,
} = require("../controllers/itemController");

// Routes
router.post("/items", addItem);
router.get("/items", getItems);
router.get("/items/:id", getItemById);
router.get("/search", searchItems);

module.exports = router;
