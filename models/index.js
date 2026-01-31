// models/index.js
const sequelize = require("../config/database");

const Book = require("./Book");
const BorrowLog = require("./BorrowLog");
const Admin = require("./admin"); // atau "./Admin" tergantung nama file kamu

module.exports = {
  sequelize,
  Book,
  BorrowLog,
  Admin,
};
