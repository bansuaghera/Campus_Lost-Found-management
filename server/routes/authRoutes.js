const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  register,
  login,
  getMe,
  updateUser,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.put("/update", auth, updateUser);

module.exports = router;
