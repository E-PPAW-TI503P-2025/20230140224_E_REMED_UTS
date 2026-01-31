// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models");
const { JWT_SECRET } = require("../middleware/authMiddleware");

// POST /api/auth/register  (buat test via Postman)
exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || password.length < 4) {
    return res.status(400).json({
      success: false,
      message: "username & password wajib (min 4 karakter)",
    });
  }

  try {
    const exists = await Admin.findOne({ where: { username } });
    if (exists) {
      return res.status(409).json({ success: false, message: "Username sudah dipakai" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, passwordHash });

    return res.json({
      success: true,
      message: "Admin registered",
      data: { id: admin.id, username: admin.username },
    });
  } catch (e) {
    console.log("❌ register error:", e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/auth/login (dipakai web login)
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "username & password wajib" });
  }

  try {
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Username/password salah" });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, message: "Username/password salah" });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: "admin" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ success: true, token });
  } catch (e) {
    console.log("❌ login error:", e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
 