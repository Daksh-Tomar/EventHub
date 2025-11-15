// server/routes/events.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// ✅ Register user for event (Trigger will handle DB updates)
router.post("/register", async (req, res) => {
  try {
    const { user_id, event_id } = req.body;
    if (!user_id || !event_id)
      return res.status(400).json({ error: "Missing user_id or event_id" });

    await pool.query(
      "INSERT INTO registration (user_id, event_id) VALUES (?, ?)",
      [user_id, event_id]
    );
    res.json({ success: true, message: "Registered successfully!" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Already registered" });
    }
    console.error("Register error:", err);
    res.status(500).json({ error: "Failed to register" });
  }
});

// ✅ Unregister user (Trigger will handle DB updates)
router.post("/unregister", async (req, res) => {
  try {
    const { user_id, event_id } = req.body;
    if (!user_id || !event_id)
      return res.status(400).json({ error: "Missing user_id or event_id" });

    const [result] = await pool.query(
      "DELETE FROM registration WHERE user_id = ? AND event_id = ?",
      [user_id, event_id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Not registered" });

    res.json({ success: true, message: "Unregistered successfully!" });
  } catch (err) {
    console.error("Unregister error:", err);
    res.status(500).json({ error: "Failed to unregister" });
  }
});

// ✅ Get user's registered events (must be above /:id)
router.get("/my/registered", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id)
      return res.status(400).json({ error: "Missing user_id parameter" });

    const [rows] = await pool.query(
      `
      SELECT e.event_id, e.name, e.start_date, e.end_date, e.description,
             COALESCE(v.name, 'TBD') AS venue_name,
             COALESCE(t.type_name, 'General') AS type_name
      FROM registration r
      JOIN event e ON r.event_id = e.event_id
      LEFT JOIN venue v ON e.venue_id = v.venue_id
      LEFT JOIN eventtype t ON e.type_id = t.type_id
      WHERE r.user_id = ?
      ORDER BY e.start_date ASC
      `,
      [user_id]
    );

    res.json({ events: rows });
  } catch (err) {
    console.error("Error fetching registered events:", err);
    res.status(500).json({ error: "Server error fetching registered events" });
  }
});

// ✅ Get all events (with computed status)
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const [rows] = await pool.query(`
      SELECT 
        e.event_id, e.name, e.description, e.start_date, e.end_date,
        e.is_paid, e.price, e.registered_count,
        COALESCE(v.name, 'TBD') AS venue_name,
        COALESCE(t.type_name, 'General') AS type_name
      FROM event e
      LEFT JOIN venue v ON e.venue_id = v.venue_id
      LEFT JOIN eventtype t ON e.type_id = t.type_id
      ORDER BY e.start_date ASC
    `);

    const now = new Date();
    let events = rows.map((e) => {
      const start = new Date(e.start_date);
      const end = new Date(e.end_date);
      let computedStatus = "upcoming";
      if (now >= start && now <= end) computedStatus = "ongoing";
      else if (now > end) computedStatus = "completed";
      return { ...e, status: computedStatus };
    });

    if (status) events = events.filter((e) => e.status === status);

    res.json({ events });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Server error fetching events" });
  }
});

// ✅ Get single event by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        e.*, 
        COALESCE(v.name, 'TBD') AS venue_name,
        COALESCE(t.type_name, 'General') AS type_name
      FROM event e
      LEFT JOIN venue v ON e.venue_id = v.venue_id
      LEFT JOIN eventtype t ON e.type_id = t.type_id
      WHERE e.event_id = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Event not found" });

    res.json({ event: rows[0] });
  } catch (err) {
    console.error("Error fetching event by ID:", err);
    res.status(500).json({ error: "Server error fetching event" });
  }
});

export default router;
