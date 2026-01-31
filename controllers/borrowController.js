// controllers/borrowController.js
const { Book, BorrowLog, sequelize } = require("../models");

// USER: POST /api/borrow
exports.borrowBook = async (req, res) => {
  const userId = Number(req.headers["x-user-id"]);
  const { bookId, latitude, longitude } = req.body;

  const parsedBookId = Number(bookId);
  const parsedLat = Number(latitude);
  const parsedLng = Number(longitude);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ success: false, message: "Invalid userId" });
  }
  if (!Number.isInteger(parsedBookId) || parsedBookId <= 0) {
    return res.status(400).json({ success: false, message: "Book ID is required" });
  }
  if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
    return res.status(400).json({ success: false, message: "Latitude and longitude are required" });
  }

  try {
    await sequelize.transaction(async (t) => {
      const book = await Book.findByPk(parsedBookId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!book) throw { status: 404, message: "Book not found" };
      if (book.stock <= 0) throw { status: 400, message: "Book is out of stock" };

      book.stock -= 1;
      await book.save({ transaction: t });

      await BorrowLog.create(
        { userId, bookId: parsedBookId, latitude: parsedLat, longitude: parsedLng },
        { transaction: t }
      );
    });

    return res.json({ success: true, message: "Book borrowed successfully" });
  } catch (err) {
    console.log("❌ borrowBook error:", err);
    const status = err?.status || 500;
    const message = err?.message || "Internal server error";
    return res.status(status).json({ success: false, message });
  }
};

// ADMIN: GET /api/borrow/logs ✅ SAFE (gabung book manual)
exports.getAllBorrowLogs = async (req, res) => {
  try {
    const logs = await BorrowLog.findAll({
      order: [["borrowDate", "DESC"]],
      raw: true,
    });

    if (!logs || logs.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const bookIds = [...new Set(logs.map((l) => l.bookId))];

    const books = await Book.findAll({
      where: { id: bookIds },
      attributes: ["id", "title", "author"],
      raw: true,
    });

    const bookMap = new Map(books.map((b) => [b.id, b]));

    const result = logs.map((log) => ({
      ...log,
      Book: bookMap.get(log.bookId) || null,
    }));

    return res.json({ success: true, data: result });
  } catch (error) {
    console.log("❌ getAllBorrowLogs error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
