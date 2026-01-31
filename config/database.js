const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "library_db",     // NAMA DATABASE
  "root",           // USERNAME MYSQL
  "marklee123##",               // PASSWORD MYSQL (kosong kalau XAMPP default)
  {
    host: "localhost",
    port: 3309,
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize;
