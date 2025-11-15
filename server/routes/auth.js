// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db.js");

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working ✅" });
});

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const [existing] = await pool.query(
      "SELECT * FROM user_account WHERE email = ?",
      [email]
    );
    if (existing.length > 0)
      return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO user_account (name, prn, email, password_hash) VALUES (?, ?, ?, ?)",
      [name, email, email, hashed]
    );

    res.json({ ok: true, message: "✅ Registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const [rows] = await pool.query(
      "SELECT user_id, name, email, password_hash FROM user_account WHERE email = ?",
      [email]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "User does not exist" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    res.json({
      ok: true,
      message: "Login successful",
      user: { id: user.user_id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
