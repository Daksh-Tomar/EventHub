// ===============================
// EventHub Frontend Script
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Helper: JSON Fetch Wrapper
  const fetchJSON = async (url, opts = {}) => {
    try {
      const res = await fetch(
        url,
        Object.assign(
          {
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
          },
          opts
        )
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      return data;
    } catch (err) {
      throw err;
    }
  };

  // ===============================
  // EVENT LISTING (Home Page)
  // ===============================
  const cards = document.getElementById("cards");
  const tabs = document.querySelectorAll(".tab");
  let currentFilter = "all";

  async function loadEvents() {
    if (!cards) return;
    cards.innerHTML =
      '<p style="grid-column:1/-1;text-align:center">Loading events...</p>';

    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      let events = data.events || [];
      if (currentFilter !== "all")
        events = events.filter((e) => e.status === currentFilter);

      if (events.length === 0) {
        cards.innerHTML =
          '<div style="grid-column:1/-1;text-align:center;color:#7b7766">No events found.</div>';
        return;
      }

      cards.innerHTML = events
        .map(
          (e) => `
        <article class="card">
          <div class="card-media" style="background-image:url('/assets/default-event.jpg')">
            <span class="badge">${e.type_name || "Event"}</span>
            <span class="price">${e.is_paid ? "$" + e.price : "Free"}</span>
          </div>
          <div class="card-body">
            <h3>${escapeHtml(e.name)}</h3>
            <ul class="meta">
              <li>📅 ${formatDate(e.start_date)}</li>
              <li>📍 ${escapeHtml(e.venue_name || "TBD")}</li>
              <li>👥 Status: ${e.status}</li>
            </ul>
            <button class="btn ghost view-detail" data-id="${e.event_id}">
              View Details →
            </button>
          </div>
        </article>`
        )
        .join("");

      document
        .querySelectorAll(".view-detail")
        .forEach((btn) => btn.addEventListener("click", onViewDetail));
    } catch (err) {
      cards.innerHTML = `<p style="color:#b33;text-align:center">Error loading events</p>`;
      console.error(err);
    }
  }

  function formatDate(d) {
    if (!d) return "TBD";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  }

  function escapeHtml(unsafe) {
    if (!unsafe) return "";
    return unsafe.replace(/[&<"'>]/g, (m) => {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[m];
    });
  }

  tabs.forEach((t) =>
    t.addEventListener("click", () => {
      tabs.forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      currentFilter = t.dataset.filter;
      loadEvents();
    })
  );

  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const registerNowBtn = document.getElementById("registerNow");
  let modalEventId = null;

  async function onViewDetail(e) {
    const id = e.currentTarget.dataset.id;
    modalEventId = id;
    modalTitle.textContent = "Loading...";
    modalBody.innerHTML = "";
    modal.classList.remove("hidden");

    try {
      const res = await fetch(`/api/events/${id}`);
      const data = await res.json();
      const ev = data.event;
      modalTitle.textContent = ev.name;
      modalBody.innerHTML = `
        <p>${ev.description || ""}</p>
        <ul>
          <li>Start: ${formatDate(ev.start_date)}</li>
          <li>End: ${formatDate(ev.end_date)}</li>
          <li>Venue: ${escapeHtml(ev.venue_name || "TBD")}</li>
          <li>Type: ${escapeHtml(ev.type_name || "General")}</li>
          <li>Paid: ${ev.is_paid ? "Yes — $" + ev.price : "Free"}</li>
        </ul>`;
    } catch (err) {
      modalTitle.textContent = "Error";
      modalBody.textContent = "Failed to load event details.";
    }
  }

  modalClose?.addEventListener("click", () => modal.classList.add("hidden"));
  modalCloseBtn?.addEventListener("click", () => modal.classList.add("hidden"));
  registerNowBtn?.addEventListener("click", () => {
    window.location.href = "/auth.html#user";
  });

  if (cards) loadEvents();

  // ===============================
  // AUTH PAGE INTERACTIONS
  // ===============================
  const userBtn = document.getElementById("userBtn");
  const facultyBtn = document.getElementById("facultyBtn");
  const userForm = document.getElementById("userForm");
  const facultyForm = document.getElementById("facultyForm");
  const showUserRegister = document.getElementById("showUserRegister");
  const showFacultyRegister = document.getElementById("showFacultyRegister");
  const backToUserLogin = document.getElementById("backToUserLogin");
  const backToFacultyLogin = document.getElementById("backToFacultyLogin");

  // === Toggle between user/faculty ===
  function showForm(activeForm, inactiveForm, activeBtn, inactiveBtn) {
    if (!activeForm || !inactiveForm) return;
    activeBtn.classList.add("active");
    inactiveBtn.classList.remove("active");
    inactiveForm.classList.add("hidden");
    inactiveForm.classList.remove("active");
    activeForm.classList.remove("hidden");
    setTimeout(() => activeForm.classList.add("active"), 50);
  }

  // ✅ STEP E: Added form toggle event listeners
  userBtn?.addEventListener("click", () =>
    showForm(userForm, facultyForm, userBtn, facultyBtn)
  );

  facultyBtn?.addEventListener("click", () =>
    showForm(facultyForm, userForm, facultyBtn, userBtn)
  );

  // === Toggle register/login views ===
  showUserRegister?.addEventListener("click", () => {
    userForm.querySelector(".login-view").classList.add("hidden");
    userForm.querySelector(".register-view").classList.remove("hidden");
  });

  backToUserLogin?.addEventListener("click", () => {
    userForm.querySelector(".register-view").classList.add("hidden");
    userForm.querySelector(".login-view").classList.remove("hidden");
  });

  showFacultyRegister?.addEventListener("click", () => {
    facultyForm.querySelector(".login-view").classList.add("hidden");
    facultyForm.querySelector(".register-view").classList.remove("hidden");
  });

  backToFacultyLogin?.addEventListener("click", () => {
    facultyForm.querySelector(".register-view").classList.add("hidden");
    facultyForm.querySelector(".login-view").classList.remove("hidden");
  });

  // ===============================
  // LOGIN + REGISTER LOGIC
  // ===============================
  // --- USER LOGIN ---
  userForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = userForm.querySelector('input[type="email"]').value.trim();
    const password = userForm
      .querySelector('input[type="password"]')
      .value.trim();

    if (!email || !password) return alert("⚠️ Please fill all fields.");

    try {
      const data = await fetchJSON("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      alert(`✅ Welcome, ${data.user.name}!`);
      localStorage.setItem("eventhub_user", data.user.name);
      localStorage.setItem("eventhub_role", "user");
      window.location.href = "/user-dashboard.html";
    } catch (err) {
      alert("❌ " + err.message);
    }
  });

  // --- USER REGISTER ---
  const userRegisterBtn = document.querySelector("#userRegister .btn.primary");
  userRegisterBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const name = document
      .querySelector("#userRegister input[type='text']")
      .value.trim();
    const email = document
      .querySelector("#userRegister input[type='email']")
      .value.trim();
    const password = document
      .querySelector("#userRegister input[type='password']")
      .value.trim();

    if (!name || !email || !password)
      return alert("⚠️ Please fill all fields.");

    try {
      const data = await fetchJSON("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      alert("✅ Registered successfully! Please login now.");
      window.location.reload();
    } catch (err) {
      alert("❌ " + err.message);
    }
  });

  // --- FACULTY LOGIN ---
  facultyForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = facultyForm.querySelector('input[type="email"]').value.trim();
    const password = facultyForm
      .querySelector('input[type="password"]')
      .value.trim();

    if (!email || !password) return alert("⚠️ Please fill all fields.");

    try {
      const data = await fetchJSON("/api/faculty/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      alert(`✅ Welcome, ${data.faculty.name}!`);
      localStorage.setItem("eventhub_user", data.faculty.name);
      localStorage.setItem("eventhub_role", "faculty");
      window.location.href = "/user-dashboard.html";
    } catch (err) {
      alert("❌ " + err.message);
    }
  });

  // --- FACULTY REGISTER ---
  const facultyRegisterBtn = document.querySelector(
    "#facultyRegister .btn.primary"
  );
  facultyRegisterBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const name = document
      .querySelector("#facultyRegister input[type='text']")
      .value.trim();
    const email = document
      .querySelector("#facultyRegister input[type='email']")
      .value.trim();
    const password = document
      .querySelector("#facultyRegister input[type='password']")
      .value.trim();

    if (!name || !email || !password)
      return alert("⚠️ Please fill all fields.");

    try {
      const data = await fetchJSON("/api/faculty/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      alert("✅ Faculty registered! Please login now.");
      window.location.reload();
    } catch (err) {
      alert("❌ " + err.message);
    }
  });
});
