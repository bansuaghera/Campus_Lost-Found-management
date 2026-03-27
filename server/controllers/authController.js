const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const transporter = require("../config/mailer");

const toSafeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

const buildResetSecret = (user) => `${process.env.JWT_SECRET}${user.password}`;

exports.register = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
    });

    res.status(201).json(toSafeUser(user));
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user: toSafeUser(user) });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email"],
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    await User.update(updates, {
      where: { id: req.user.id },
    });

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email"],
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      return res.status(500).json({
        msg: "Mail service is not configured yet. Add MAIL_USER and MAIL_PASS in server/.env.",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "No user found with this email address" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, buildResetSecret(user), {
      expiresIn: "15m",
    });
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/reset-password/${user.id}/${encodeURIComponent(token)}`;

    try {
      await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: user.email,
        subject: "Reset your Campus Lost & Found password",
        text: `Reset your password using this link: ${resetLink}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
            <h2>Reset your password</h2>
            <p>Hello ${user.name || "there"},</p>
            <p>We received a request to reset your password for Campus Lost & Found.</p>
            <p>
              <a href="${resetLink}" style="display:inline-block;padding:12px 18px;background:#c96c3b;color:#fffaf5;text-decoration:none;border-radius:999px;">
                Reset Password
              </a>
            </p>
            <p>If the button does not work, copy this link into your browser:</p>
            <p>${resetLink}</p>
            <p>This link expires in 15 minutes.</p>
          </div>
        `,
      });

      return res.json({ msg: "Password reset link sent to your email address" });
    } catch (mailError) {
      if (process.env.NODE_ENV !== "production") {
        return res.json({
          msg: "Mail delivery is unavailable in this environment, but the reset link was generated.",
          resetLink,
        });
      }

      throw mailError;
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { userId, token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ msg: "Password and confirm password are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Password and confirm password do not match" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    jwt.verify(token, buildResetSecret(user));

    const hash = await bcrypt.hash(password, 10);
    await user.update({ password: hash });

    res.json({ msg: "Password has been reset successfully" });
  } catch (error) {
    res.status(400).json({ msg: "Reset link is invalid or has expired" });
  }
};
