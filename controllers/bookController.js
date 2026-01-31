// controllers/bookController.js
const { Book, BorrowLog, sequelize } = require("../models");

// GET /api/books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll({ order: [["id", "ASC"]] });
    return res.json({ success: true, data: books });
  } catch (e) {
    console.log("❌ getAllBooks error:", e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/books/:id
exports.getBookById = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Invalid book id" });
  }

  try {
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    return res.json({ success: true, data: book });
  } catch (e) {
    console.log("❌ getBookById error:", e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/books (ADMIN)
exports.createBook = async (req, res) => {
  const { title, author, stock } = req.body;
  const parsedStock = Number(stock);

  if (!title || !author) {
    return res.status(400).json({ success: false, message: "Title and author are required" });
  }
  if (!Number.isInteger(parsedStock) || parsedStock < 0) {
    return res.status(400).json({ success: false, message: "Stock must be an integer >= 0" });
  }

  try {
    const book = await Book.create({ title, author, stock: parsedStock });
    return res.json({ success: true, data: book });
  } catch (e) {
    console.log("❌ createBook error:", e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PUT /api/books/:id (ADMIN)
exports.updateBook = async (req, res) => {
  const id = Number(req.params.id);
  const { title, author, stock } = req.body;
  const parsedStock = Number(stock);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Invalid book id" });
  }
  if (!title || !author) {
    return res.status(400).json({ success: false, message: "Title and author are required" });
  }
  if (!Number.isInteger(parsedStock) || parsedStock < 0) {
    return res.status(400).json({ success: false, message: "Stock must be an integer >= 0" });
  }

  try {
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    book.title = title;
    book.author = author;
    book.stock = parsedStock;

    await book.save();
    return res.json({ success: true, data: book });
  } catch (e) {
    console.log("❌ updateBook error:", e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /api/books/:id (ADMIN) ✅ FIX FK borrow_logs
exports.deleteBook = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Invalid book id" });
  }

  try {
    await sequelize.transaction(async (t) => {
      // ✅ hapus dulu semua borrow_logs yg refer ke book ini (biar FK aman)
      await BorrowLog.destroy({ where: { bookId: id }, transaction: t });

      // ✅ baru hapus bukunya
      const deleted = await Book.destroy({ where: { id }, transaction: t });
      if (!deleted) throw { status: 404, message: "Book not found" };
    });

    return res.json({ success: true, message: "Book deleted successfully" });
  } catch (err) {
    console.log("❌ deleteBook error:", err);
    const status = err?.status || 500;
    const message = err?.message || "Internal server error";
    return res.status(status).json({ success: false, message });
  }
};
