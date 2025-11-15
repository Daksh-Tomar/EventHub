const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db.js");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Faculty route working ✅" });
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const [existing] = await pool.query(
      "SELECT * FROM faculty WHERE faculty_email = ?",
      [email]
    );
    if (existing.length > 0)
      return res.status(400).json({ error: "Faculty already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO faculty (faculty_name, faculty_email, faculty_prn) VALUES (?, ?, ?)",
      [name, email, email]
    );

    res.json({ message: "✅ Faculty registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const [rows] = await pool.query(
      "SELECT * FROM faculty WHERE faculty_email = ?",
      [email]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Faculty does not exist" });

    const faculty = rows[0];
    res.json({
      message: "Login successful",
      faculty: {
        id: faculty.faculty_id,
        name: faculty.faculty_name,
        email: faculty.faculty_email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
