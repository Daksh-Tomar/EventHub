// server/routes/registration.js
const express = require("express");
const pool = require("../db");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

// POST /api/register -> user registers for an event (requires user JWT)
router.post("/register", verifyToken, requireRole("user"), async (req, res) => {
  try {
    const { event_id, extra_info } = req.body;
    if (!event_id) return res.status(400).json({ error: "Missing event_id" });

    const [r] = await pool.execute(
      `INSERT INTO registration (user_id, event_id, extra_info) VALUES (?, ?, ?)`,
      [req.user.sub, event_id, extra_info || null]
    );
    res.json({ success: true, registration_id: r.insertId });
  } catch (err) {
    if (err && err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "Already registered" });
    console.error(err);
    res.status(500).json({ error: "Server error registering" });
  }
});

// GET /api/my-events -> list events current user registered to
router.get("/my-events", verifyToken, requireRole("user"), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT e.event_id, e.name, e.description, e.start_date, e.end_date, e.is_paid, e.price, v.name AS venue_name, t.type_name, r.registration_id, r.registration_date
      FROM registration r
      JOIN event e ON r.event_id = e.event_id
      LEFT JOIN venue v ON e.venue_id = v.venue_id
      LEFT JOIN eventtype t ON e.type_id = t.type_id
      WHERE r.user_id = ?
      ORDER BY e.start_date ASC
    `,
      [req.user.sub]
    );

    res.json({ events: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching my-events" });
  }
});

module.exports = router;
