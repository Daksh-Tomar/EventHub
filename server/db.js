// server/db.js
require("dotenv").config();
const mysql = require("mysql2/promise");

// ✅ Create MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "eventhub",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test DB connection (safe sync test)
(async () => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS connected_at");
    console.log("🟢 Database connected successfully at:", rows[0].connected_at);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

module.exports = pool;
