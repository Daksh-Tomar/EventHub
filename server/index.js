// server/index.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import pool from "./db.js";

import authRoutes from "./routes/auth.js";
import facultyRoutes from "./routes/faculty.js";
import eventsRoutes from "./routes/events.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve directories
const ROOT_DIR = path.resolve(process.cwd(), ".."); // eventhub/
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// ✅ Dynamic favicon route (works for both /public/favicon.ico or /favicon.ico)
app.get("/favicon.ico", (req, res) => {
  const rootIcon = path.join(ROOT_DIR, "favicon.ico");
  const publicIcon = path.join(PUBLIC_DIR, "favicon.ico");

  if (fs.existsSync(publicIcon)) {
    res.sendFile(publicIcon);
  } else if (fs.existsSync(rootIcon)) {
    res.sendFile(rootIcon);
  } else {
    res.status(404).end();
  }
});

// ✅ Automatically inject favicon tag if missing in HTML
app.use((req, res, next) => {
  if (req.path.endsWith(".html")) {
    const filePath = path.join(PUBLIC_DIR, req.path);
    if (fs.existsSync(filePath)) {
      let html = fs.readFileSync(filePath, "utf8");
      if (!html.includes('rel="icon"')) {
        html = html.replace(
          "</head>",
          `  <link rel="icon" type="image/x-icon" href="/favicon.ico">\n</head>`
        );
      }
      return res.send(html);
    }
  }
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("✅ EventHub backend is running!");
});

// DB test route
app.get("/api/dbtest", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS time");
    res.json({ message: "Database connected", time: rows[0].time });
  } catch (err) {
    console.error("DB test error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/events", eventsRoutes);

// 404 handler
app.use((req, res) => {
  console.log("❌ Route not found:", req.originalUrl);
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📂 Serving static files from: ${PUBLIC_DIR}`);
});
