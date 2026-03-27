const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  addResponse,
  getResponses,
  getMyResponses,
} = require("../controllers/responseController");

router.get("/response/my", auth, getMyResponses);
router.get("/response/:itemId", getResponses);
router.post("/response", auth, addResponse);

module.exports = router;
