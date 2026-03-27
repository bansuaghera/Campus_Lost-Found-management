const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash,
  });

  res.json(user);
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.json({ token });
};

// Get Profile
exports.getMe = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ["id", "name", "email"],
  });
  res.json(user);
};

// Update Profile
exports.updateUser = async (req, res) => {
  await User.update(req.body, {
    where: { id: req.user.id },
  });
  res.json({ msg: "Updated" });
};
