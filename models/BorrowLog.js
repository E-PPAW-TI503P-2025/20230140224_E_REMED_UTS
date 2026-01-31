const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BorrowLog = sequelize.define(
  "BorrowLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    borrowDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "borrow_logs", // WAJIB sama dengan tabel di MySQL
    timestamps: false,        // karena tabel manual (tanpa createdAt & updatedAt)
  }
);

module.exports = BorrowLog;
