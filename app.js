// app.js
const express = require("express");
const path = require("path");

const { sequelize } = require("./models");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const borrowRoutes = require("./routes/borrowRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// frontend static
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

// default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 API handler
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ success: false, message: "Endpoint not found" });
  }
  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    await sequelize.sync();
    console.log("✅ Database synced");

    app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
  } catch (e) {
    console.error("❌ Failed to start server:", e);
    process.exit(1);
  }
})();
