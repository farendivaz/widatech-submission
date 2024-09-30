const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Fariz2002@",
  database: "invoice_management",
});

module.exports = pool.promise();
