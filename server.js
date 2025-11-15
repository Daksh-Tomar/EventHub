// server.js (root level)
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

// --------------------
// MIDDLEWARE
// --------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// --------------------
// DATABASE CONNECTION
// --------------------
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "eventhub",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// --------------------
// SESSION STORE
// --------------------
const sessionStore = new MySQLStore({}, pool);

app.use(
  session({
    key: "eventhub_session_cookie",
    secret: process.env.SESSION_SECRET || "change_this_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// --------------------
// ROUTE IMPORTS (now correct for your folder structure)
// --------------------
const authRoutes = require("./server/routes/auth.js");
const facultyRoutes = require("./server/routes/faculty.js");
const registrationRoutes = require("./server/routes/registration.js");
const eventsRoutes = require("./server/routes/events.js");

// --------------------
// ROUTE MOUNTS
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/events", eventsRoutes);

// --------------------
// STATIC FRONTEND (correct path)
// --------------------
app.use(express.static(path.join(__dirname, "public")));

// --------------------
// HELPERS
// --------------------
function requireLogin(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ error: "Not authenticated" });
}

function requireFaculty(req, res, next) {
  if (req.session && req.session.faculty) return next();
  return res.status(401).json({ error: "Faculty auth required" });
}

// --------------------
// BASIC AUTH ROUTES (these can remain inline)
// --------------------
app.post("/api/auth/register", async (req, res) => {
  const { name, prn, email, password } = req.body;
  if (!name || !prn || !password)
    return res.status(400).json({ error: "Missing fields" });
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      `INSERT INTO user_account (name, prn, email, password_hash) VALUES (?, ?, ?, ?)`,
      [name, prn, email || null, hash]
    );
    return res.json({ success: true, user_id: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "PRN or email already exists" });
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { prn, password } = req.body;
  if (!prn || !password)
    return res.status(400).json({ error: "Missing fields" });
  try {
    const [rows] = await pool.execute(
      `SELECT user_id, name, prn, password_hash FROM user_account WHERE prn = ? OR email = ?`,
      [prn, prn]
    );
    if (rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    req.session.user = {
      user_id: user.user_id,
      name: user.name,
      prn: user.prn,
    };
    return res.json({ success: true, user: req.session.user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
