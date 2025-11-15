<h1 align="center">🎉 EventHub — Full-Stack Event Management System</h1>

<p align="center">
  A complete event management platform built using 
  <b>Node.js, Express.js, MySQL, and Vanilla JavaScript</b>.
  <br/>
  Users can browse, register, and manage events, while faculty can create and manage events with full backend support.
</p>

<br/>

<h2 align="center">🚀 Tech Stack & Badges</h2>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-Backend-blue?logo=express" />
  <img src="https://img.shields.io/badge/MySQL-Database-orange?logo=mysql" />
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-yellow" />
  <img src="https://img.shields.io/badge/License-MIT-red" />
</p>

<hr/>

<h2>📌 Overview</h2>

<p>
EventHub is a modern full-stack web application that allows:
</p>

<ul>
  <li>👤 Users to register/login, browse events, register/unregister, and view their own event history.</li>
  <li>🎓 Faculty to create and manage events with real-time registration counts powered by MySQL triggers.</li>
  <li>📅 Automatic event status categorization — upcoming, ongoing, completed.</li>
  <li>📊 Dashboards for both users and faculty with clean visuals and interactive UI.</li>
</ul>

<br/>

<hr/>

<h2>📁 Project Structure</h2>

<pre>
EventHub/
│
├── public/                      # Frontend
│   ├── index.html               # Landing page
│   ├── user-dashboard.html      # User dashboard
│   ├── faculty-dashboard.html   # Faculty dashboard
│   ├── auth.html                # Login page
│   ├── favicon.ico
│   │
│   ├── css/
│   │   └── styles.css
│   │
│   ├── js/
│   │   └── dashboard.js
│   │
│   └── assets/
│       ├── avatar.svg
│       ├── placeholder.png
│       ├── hero-bg.jpg
│       └── auth-bg.jpeg
│
├── server/
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── index.js                 # Main Express server
│   ├── db.js                    # MySQL connection
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── registration.js
│   │   ├── events.js
│   │   └── faculty.js
│   │
│   └── .env
│
├── sql/
│   └── db.sql                   # Full database schema
│
├── server.js                    # (Legacy backup)
├── .env
└── README.md
</pre>

<hr/>

<h2>🎨 Features</h2>

<ul>
  <li><b>Role-based dashboards</b> for users & faculty</li>
  <li><b>JWT Authentication</b> (Login/Register)</li>
  <li><b>MySQL triggers</b> automatically manage registration count</li>
  <li><b>Full event lifecycle management</b></li>
  <li><b>Interactive UI</b> with status filtering</li>
  <li><b>View Event Details Modal</b></li>
</ul>

<hr/>

<h2>🗄️ Database Schema</h2>

<p>The DB includes:</p>
<ul>
  <li><code>user_account</code></li>
  <li><code>faculty</code></li>
  <li><code>event</code></li>
  <li><code>registration</code></li>
  <li><code>venue</code></li>
  <li><code>eventtype</code></li>
</ul>

<h3>🔧 MySQL Triggers</h3>

<pre>
-- Increase count
CREATE TRIGGER trg_increment_registered_count
AFTER INSERT ON registration
FOR EACH NEW ROW
UPDATE event SET registered_count = registered_count + 1
WHERE event_id = NEW.event_id;

-- Decrease count
CREATE TRIGGER trg_decrement_registered_count
AFTER DELETE ON registration
FOR EACH OLD ROW
UPDATE event SET registered_count = registered_count - 1
WHERE event_id = OLD.event_id;
</pre>

<hr/>

<h2>📌 IMPORTANT NOTE — Avoid Foreign Key Errors</h2>

<p>This project ships with sample data.  
To avoid errors when creating events or registering users, your DB must contain:</p>

<ul>
  <li><b>At least 3 Users</b></li>
  <li><b>At least 4 Faculty members</b></li>
</ul>

<h3>✔️ How to Add Them (NO SQL Required)</h3>

<ol>
  <li>Run the server</li>
  <li>Go to <b>User → Register</b> and create 3 users</li>
  <li>Go to <b>Faculty → Register</b> and create 4 faculty accounts</li>
</ol>

<hr/>

<h2>📥 Database Dataset & Seed Data</h2>

<p>
This repository contains a folder with the full dataset used during development.
</p>

<h3>📂 Dataset Folder Location:</h3>

<p>
<a href="https://github.com/Daksh-Tomar/EventHub/tree/fbbe762a34d1ef33e17f3cc6cd286d293e3293ea/DBMS%20Project">
📌 <b>DBMS Project → database</b>
</a>
</p>

<h3>📄 Included Files</h3>

<ul>
  <li><b>event_management_full_dataset.xlsx</b> — Full tabular dataset used in development</li>
  <li><b>eventhub_seed_data.sql</b> — SQL seed inserts for all tables</li>
</ul>

<p>
These files contain all default inserted values used for testing during development.
</p>

<hr/>

<h2>📚 Project PPT & ER Model</h2>

<p>The following resources are included for documentation and academic submission:</p>

<ul>
  <li>
    📘 <b>Project PPT (PDF)</b> →  
    <a href="https://github.com/Daksh-Tomar/EventHub/blob/fbbe762a34d1ef33e17f3cc6cd286d293e3293ea/DBMS%20Project/DBMS%20project.pdf">
      View / Download
    </a>
  </li>

  <li>
    🧩 <b>ER Model Diagram (JPG)</b> →  
    <a href="https://github.com/Daksh-Tomar/EventHub/blob/fbbe762a34d1ef33e17f3cc6cd286d293e3293ea/DBMS%20Project/er%20model.jpg">
      View Diagram
    </a>
  </li>
</ul>

<hr/>

<h2>📡 API Documentation</h2>

<h3>🔐 Authentication</h3>

<table>
<tr><th>Method</th><th>Route</th><th>Description</th></tr>
<tr><td>POST</td><td>/api/auth/register</td><td>User/Faculty Registration</td></tr>
<tr><td>POST</td><td>/api/auth/login</td><td>Login → Returns JWT</td></tr>
</table>

<h3>📅 Events</h3>

<table>
<tr><th>Method</th><th>Route</th><th>Description</th></tr>
<tr><td>GET</td><td>/api/events</td><td>Get all events</td></tr>
<tr><td>GET</td><td>/api/events?status=ongoing</td><td>Filter events</td></tr>
<tr><td>GET</td><td>/api/events/:id</td><td>Get event details</td></tr>
</table>

<h3>📝 Registration</h3>

<table>
<tr><th>Method</th><th>Route</th><th>Description</th></tr>
<tr><td>POST</td><td>/api/events/register</td><td>Register user for event</td></tr>
<tr><td>POST</td><td>/api/events/unregister</td><td>Unregister user</td></tr>
<tr><td>GET</td><td>/api/events/my/registered?user_id=</td><td>Get user's events</td></tr>
</table>

<h3>🎓 Faculty</h3>

<table>
<tr><th>Method</th><th>Route</th><th>Description</th></tr>
<tr><td>POST</td><td>/api/faculty/create</td><td>Create event</td></tr>
<tr><td>GET</td><td>/api/faculty/events?faculty_id=</td><td>Get created events</td></tr>
</table>

<hr/>

<h2>🖥️ Run Locally</h2>

<h3>1️⃣ Clone</h3>
<pre>
git clone https://github.com/Daksh-Tomar/EventHub.git
cd EventHub
</pre>

<h3>2️⃣ Install</h3>
<pre>
cd server
npm install
</pre>

<h3>3️⃣ Setup Database</h3>
<pre>
mysql -u root -p
CREATE DATABASE eventhub;
USE eventhub;
SOURCE sql/db.sql;
</pre>

<h3>4️⃣ Add Triggers</h3>
<pre>
SOURCE sql/triggers.sql;
</pre>

<h3>5️⃣ Configure <code>.env</code></h3>
<pre>
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=eventhub
JWT_SECRET=yoursecret
PORT=3000
</pre>

<h3>6️⃣ Start Server</h3>
<pre>
node index.js
</pre>

<h3>7️⃣ Open in Browser</h3>
<pre>
http://localhost:3000
</pre>

<hr/>

<h2>🤝 Contributing</h2>

<p>
Contributions are welcome!  
Follow these steps to contribute:
</p>

<ol>
  <li>🍴 Fork the repository</li>
  <li>🌿 Create a new branch:
  <pre>git checkout -b feature-name</pre></li>
  <li>🛠️ Make your changes</li>
  <li>💾 Commit:
  <pre>git commit -m "Added new feature"</pre></li>
  <li>📤 Push:
  <pre>git push origin feature-name</pre></li>
  <li>🔄 Open a Pull Request</li>
</ol>

<hr/>

<h2>📸 Screenshots (Recommended)</h2>

<p>Add inside <code>public/assets/</code> then reference:</p>

<pre>
<img src="public/assets/screenshot1.png" width="700">
</pre>

Suggested screenshots:
<ul>
  <li>Login Page</li>
  <li>User Dashboard</li>
  <li>Faculty Dashboard</li>
  <li>Event Details Modal</li>
  <li>My Events Page</li>
</ul>

<hr/>

<h2>📄 License</h2>
<p>This project is released under the <b>MIT License</b>.</p>

<hr/>

<h2 align="center">⭐ If you found this useful, consider starring the repo!</h2>
