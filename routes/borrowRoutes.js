// routes/borrowRoutes.js
const express = require("express");
const router = express.Router();

const { borrowBook, getAllBorrowLogs } = require("../controllers/borrowController");
const { requireAdmin } = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");

// USER borrow (header: x-user-role=user, x-user-id)
router.post("/", checkRole(["user"]), borrowBook);

// ADMIN lihat logs (JWT)
router.get("/logs", requireAdmin, getAllBorrowLogs);

module.exports = router;
