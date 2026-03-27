const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  register,
  login,
  getMe,
  updateUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:userId/:token", resetPassword);
router.get("/me", auth, getMe);
router.put("/update", auth, updateUser);

module.exports = router;
