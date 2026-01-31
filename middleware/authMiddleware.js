// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret123"; // boleh ganti

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (payload.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    req.admin = payload; // {id, username, role}
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

module.exports = { requireAdmin, JWT_SECRET };
