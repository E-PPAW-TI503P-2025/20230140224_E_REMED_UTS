// routes/bookRoutes.js
const express = require("express");
const router = express.Router();

const bookController = require("../controllers/bookController");
const { requireAdmin } = require("../middleware/authMiddleware");

// PUBLIC
router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);

// ADMIN (JWT)
router.post("/", requireAdmin, bookController.createBook);
router.put("/:id", requireAdmin, bookController.updateBook);
router.delete("/:id", requireAdmin, bookController.deleteBook);

module.exports = router;
