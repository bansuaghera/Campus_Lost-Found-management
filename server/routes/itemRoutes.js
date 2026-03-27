const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  addItem,
  getItems,
  getItem,
  getMyItems,
  updateStatus,
  searchItems,
} = require("../controllers/itemController");

router.get("/items", getItems);
router.get("/items/my", auth, getMyItems);
router.get("/items/:id", getItem);
router.get("/search", searchItems);
router.post("/items", auth, addItem);
router.put("/items/:id/status", auth, updateStatus);

module.exports = router;
