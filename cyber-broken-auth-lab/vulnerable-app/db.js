const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "mysql",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "broken_auth"
});


function checkMySQL(retry = 0) {
  pool.getConnection((err, conn) => {
    if (err) {
      console.log(`MySQL not ready (retry ${retry}), retrying...`);
      return setTimeout(() => checkMySQL(retry + 1), 3000);
    }

    conn.ping((pingErr) => {
      if (!pingErr) console.log("MySQL connected.");
      conn.release();
    });
  });
}

checkMySQL();

module.exports = pool;
