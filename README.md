<h1 align="center">🎉 EventHub – College Event Management System</h1>

<p align="center">
A modern full-stack event management system built for colleges — enabling students to browse & register for events while faculty members manage event creation and participation.
</p>

<hr/>

<h2>📌 Overview</h2>
<p>
EventHub is a complete event management platform featuring:
</p>
<ul>
  <li>A <b>user dashboard</b> to browse, register, view & track events</li>
  <li>A <b>faculty dashboard</b> to create & manage events</li>
  <li>Automatic status detection (Upcoming / Ongoing / Completed)</li>
  <li>Smart MySQL triggers to auto-update registration counts</li>
</ul>

<hr/>

<h2>🚀 Screenshots</h2>

<table>
<tr>
<td><img src="screenshots/dashboard.png" width="300"/></td>
<td><img src="screenshots/events.png" width="300"/></td>
<td><img src="screenshots/faculty.png" width="300"/></td>
</tr>
</table>

<i>Place your images inside a <code>screenshots/</code> folder in the repository.</i>

<hr/>

<h2>🛠️ Tech Stack</h2>

<h3>Frontend</h3>
<ul>
  <li>HTML5</li>
  <li>CSS3</li>
  <li>Vanilla JavaScript</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Node.js</li>
  <li>Express.js</li>
  <li>MySQL</li>
  <li>SQL Triggers</li>
</ul>

<h3>Database Tables</h3>
<ul>
  <li>event</li>
  <li>venue</li>
  <li>eventtype</li>
  <li>users</li>
  <li>registration</li>
</ul>

<hr/>

<h2>🌟 Features</h2>

<h3>👤 User Features</h3>
<ul>
  <li>View upcoming, ongoing & completed events</li>
  <li>Register / Unregister for events</li>
  <li>View “My Events” section</li>
  <li>Event details popup</li>
  <li>Registration count auto-updates</li>
</ul>

<h3>🎓 Faculty Features</h3>
<ul>
  <li>Create new events</li>
  <li>Edit event info</li>
  <li>Delete events</li>
  <li>Manage participants</li>
</ul>

<h3>🔥 System Features</h3>
<ul>
  <li>MySQL triggers handle register/unregister logic</li>
  <li>Automatic event categorization</li>
  <li>Clean modular API</li>
  <li>Fully responsive frontend</li>
</ul>

<hr/>

<h2>📁 Project Structure</h2>

<pre>
EventHub/
│
├── public/
│   ├── index.html
│   ├── user-dashboard.html
│   ├── faculty-dashboard.html
│   ├── auth.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── dashboard.js
│   └── assets/
│       ├── avatar.svg
│       ├── placeholder.png
│       └── auth-bg.jpeg
│
├── server/
│   ├── index.js
│   ├── db.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   └── faculty.js
│   └── .env
│
└── README.md
</pre>

<hr/>

<h2>🧩 Database Setup</h2>

<h3>Create Main Table</h3>
<pre>
CREATE TABLE event (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    is_paid BOOLEAN DEFAULT 0,
    price DECIMAL(10,2),
    venue_id INT,
    type_id INT,
    registered_count INT DEFAULT 0
);
</pre>

<h3>SQL Triggers</h3>

<b>➕ Trigger: Increment on Register</b>
<pre>
CREATE TRIGGER trg_increment_registration
AFTER INSERT ON registration
FOR EACH ROW
UPDATE event
SET registered_count = registered_count + 1
WHERE event_id = NEW.event_id;
</pre>

<b>➖ Trigger: Decrement on Unregister</b>
<pre>
CREATE TRIGGER trg_decrement_registration
AFTER DELETE ON registration
FOR EACH ROW
UPDATE event
SET registered_count = registered_count - 1
WHERE event_id = OLD.event_id AND registered_count > 0;
</pre>

<hr/>

<h2>⚙️ How to Run Locally</h2>

<h3>1️⃣ Clone the repository</h3>
<pre>
git clone https://github.com/Daksh-Tomar/EventHub.git
cd EventHub/server
</pre>

<h3>2️⃣ Install dependencies</h3>
<pre>
npm install
</pre>

<h3>3️⃣ Create a <code>.env</code> file</h3>
<pre>
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=eventhub
PORT=3000
</pre>

<h3>4️⃣ Start the backend</h3>
<pre>
node index.js
</pre>

<h3>5️⃣ Open frontend</h3>
<pre>
http://localhost:3000/index.html
</pre>

<hr/>

<h2>📡 API Endpoints</h2>

<h3>🔐 Auth</h3>
<ul>
  <li><code>POST /api/auth/login</code></li>
  <li><code>POST /api/auth/register</code></li>
</ul>

<h3>📅 Events</h3>
<ul>
  <li><code>GET /api/events</code> – All events</li>
  <li><code>GET /api/events/:id</code> – Event details</li>
  <li><code>GET /api/events/my/registered</code> – User registered events</li>
  <li><code>POST /api/events/register</code> – Register</li>
  <li><code>POST /api/events/unregister</code> – Unregister</li>
</ul>

<h3>🎓 Faculty</h3>
<ul>
  <li><code>POST /api/faculty/event</code> – Create</li>
  <li><code>PUT /api/faculty/event/:id</code> – Update</li>
  <li><code>DELETE /api/faculty/event/:id</code> – Delete</li>
</ul>

<hr/>

<h2>🤝 Contributing</h2>
<p>
Fork → create branch → commit → pull request.  
Contributions are welcome!
</p>

<hr/>

<h2>📜 License</h2>
<p>
Licensed under the <b>MIT License</b>.
</p>

<hr/>

<h2>🙌 Credits</h2>
<p>
Developed by <b>Daksh Tomar</b>.  
If you liked this project, please ⭐ star the repository!
</p>
