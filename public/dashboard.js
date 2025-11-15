// ==================== DASHBOARD.JS (FINAL UPDATED) ====================

const API_BASE = "http://localhost:3000/api/events";
const eventsList = document.getElementById("eventsList");
const statsContainer = document.querySelector(".stats");
const logoutBtn = document.getElementById("logoutBtn");
const usernameDisplay = document.getElementById("username");
const sidebarLinks = document.querySelectorAll(".sidebar nav a");

// --- USER SESSION ---
const loggedInUser = JSON.parse(localStorage.getItem("user")) || {
  id: 1,
  name: "User",
};
if (usernameDisplay) usernameDisplay.textContent = loggedInUser.name;

// --- DATE FORMATTER ---
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// --- LOAD EVENTS (all or by status) ---
async function loadEvents(filterStatus = null) {
  try {
    const res = await fetch(API_BASE);
    const data = await res.json();
    const events = data.events || [];
    const now = new Date();

    const upcoming = events.filter((e) => new Date(e.start_date) > now);
    const ongoing = events.filter(
      (e) => new Date(e.start_date) <= now && new Date(e.end_date) >= now
    );
    const completed = events.filter((e) => new Date(e.end_date) < now);

    statsContainer.innerHTML = `
      <div class="stat-card" data-status="upcoming"><h3>${upcoming.length}</h3><p>Upcoming Events</p></div>
      <div class="stat-card" data-status="ongoing"><h3>${ongoing.length}</h3><p>Ongoing</p></div>
      <div class="stat-card" data-status="completed"><h3>${completed.length}</h3><p>Completed</p></div>
    `;

    let filtered = events;
    if (filterStatus)
      filtered = events.filter((e) => e.status === filterStatus);
    await renderEvents(filtered);

    document.querySelectorAll(".stat-card").forEach((card) => {
      card.addEventListener("click", () => loadEvents(card.dataset.status));
    });
  } catch (err) {
    console.error("Error loading events:", err);
    eventsList.innerHTML = "<p>Error loading events.</p>";
  }
}

// --- LOAD USER'S REGISTERED EVENTS ("My Events") ---
async function loadMyEvents() {
  try {
    const res = await fetch(
      `${API_BASE}/my/registered?user_id=${loggedInUser.id}`
    );
    const data = await res.json();
    if (!data.events || data.events.length === 0) {
      eventsList.innerHTML =
        "<p>You haven’t registered for any events yet.</p>";
      return;
    }

    // Add computed status for each event
    const now = new Date();
    const enriched = data.events.map((e) => {
      const start = new Date(e.start_date);
      const end = new Date(e.end_date);
      let status = "upcoming";
      if (now >= start && now <= end) status = "ongoing";
      else if (now > end) status = "completed";
      return { ...e, status };
    });

    // Show heading + render
    statsContainer.innerHTML = `
      <div class="stat-card"><h3>${enriched.length}</h3><p>Registered Events</p></div>
    `;
    await renderEvents(enriched);
  } catch (err) {
    console.error("Error loading my events:", err);
    eventsList.innerHTML =
      "<p class='error'>Failed to load your registered events.</p>";
  }
}

// --- RENDER EVENTS + REGISTER / UNREGISTER ---
async function renderEvents(events) {
  if (!eventsList) return;
  if (events.length === 0) {
    eventsList.innerHTML = "<p>No events found.</p>";
    return;
  }

  let registeredIds = [];
  try {
    const res = await fetch(
      `${API_BASE}/my/registered?user_id=${loggedInUser.id}`
    );
    const data = await res.json();
    registeredIds = data.events.map((e) => e.event_id);
  } catch {}

  eventsList.innerHTML = events
    .map((e) => {
      const isRegistered = registeredIds.includes(e.event_id);
      const isCompleted = e.status === "completed";

      let buttonHTML = "";
      if (isCompleted) {
        buttonHTML = `<span class="btn" style="background: gray; cursor: not-allowed;">Completed</span>`;
      } else {
        buttonHTML = `
          <button class="btn view-btn" data-id="${e.event_id}">View</button>
          <button class="btn ${
            isRegistered ? "unregister-btn" : "register-btn"
          }" data-id="${e.event_id}">
            ${isRegistered ? "Unregister" : "Register"}
          </button>`;
      }

      return `
        <div class="event-card">
          <div class="event-info">
            <h3>${e.name}</h3>
            <p>${formatDate(e.start_date)} - ${e.venue_name || "TBD"}</p>
            <p><b>Status:</b> ${e.status}</p>
          </div>
          <div class="event-actions">${buttonHTML}</div>
        </div>`;
    })
    .join("");

  // View details
  document
    .querySelectorAll(".view-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => showEventDetails(btn.dataset.id))
    );

  // Register
  document.querySelectorAll(".register-btn").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      try {
        const res = await fetch(`${API_BASE}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: loggedInUser.id, event_id: id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message);
        alert("✅ Registered successfully!");
        btn.textContent = "Unregister";
        btn.classList.replace("register-btn", "unregister-btn");
        attachUnregisterHandler(btn);
      } catch (err) {
        alert("Registration failed: " + err.message);
      }
    })
  );

  // Unregister
  document.querySelectorAll(".unregister-btn").forEach(attachUnregisterHandler);
}

function attachUnregisterHandler(btn) {
  btn.addEventListener("click", async () => {
    const id = btn.dataset.id;
    try {
      const res = await fetch(`${API_BASE}/unregister`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: loggedInUser.id, event_id: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);
      alert("🗑️ Unregistered successfully!");
      btn.textContent = "Register";
      btn.classList.replace("unregister-btn", "register-btn");
      attachRegisterHandler(btn);
    } catch (err) {
      alert("Unregister failed: " + err.message);
    }
  });
}

function attachRegisterHandler(btn) {
  btn.addEventListener("click", async () => {
    const id = btn.dataset.id;
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: loggedInUser.id, event_id: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);
      alert("✅ Registered successfully!");
      btn.textContent = "Unregister";
      btn.classList.replace("register-btn", "unregister-btn");
      attachUnregisterHandler(btn);
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  });
}

// --- EVENT DETAILS MODAL ---
async function showEventDetails(eventId) {
  try {
    const res = await fetch(`${API_BASE}/${eventId}`);
    const data = await res.json();
    const ev = data.event;
    const modal = document.createElement("div");
    modal.className = "event-modal";
    modal.innerHTML = `
      <div class="modal-content">
        <h2>${ev.name}</h2>
        <p><b>Venue:</b> ${ev.venue_name}</p>
        <p><b>Start:</b> ${formatDate(ev.start_date)}</p>
        <p><b>End:</b> ${formatDate(ev.end_date)}</p>
        <p><b>Description:</b> ${
          ev.description || "No description available."
        }</p>
        <button class="btn" id="closeModal">Close</button>
      </div>`;
    document.body.appendChild(modal);
    document.getElementById("closeModal").onclick = () => modal.remove();
  } catch (err) {
    alert("Error loading event details.");
  }
}

// --- SIDEBAR NAVIGATION ---
sidebarLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    sidebarLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    const text = link.textContent.trim().toLowerCase();
    if (text === "dashboard") loadEvents();
    else if (text === "my events") loadMyEvents();
    else eventsList.innerHTML = "<p>Profile section coming soon!</p>";
  });
});

// --- LOGOUT ---
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "/auth.html";
});

// --- INITIAL LOAD ---
loadEvents();

// ==================== END DASHBOARD.JS ====================
