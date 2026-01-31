// public/script.js
console.log("✅ script.js loaded (USER)");

const API_BASE = "/api";
let allBooks = [];

function $(id) {
  return document.getElementById(id);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getUserId() {
  const val = Number($("userIdInput")?.value);
  return Number.isInteger(val) && val > 0 ? val : 1;
}

function setStatus(msg) {
  const el = $("statusMsg");
  if (el) el.textContent = msg || "";
}

function setBorrowStatus(msg) {
  const el = $("borrowStatus");
  if (el) el.textContent = msg || "";
}

function openModal(book) {
  $("bookId").value = String(book.id);
  $("modalBookName").textContent = book.title;
  $("modalBookMeta").textContent = `Oleh: ${book.author} • Stock: ${book.stock}`;

  $("latitude").value = "";
  $("longitude").value = "";
  setBorrowStatus("");

  $("borrowModal").classList.remove("hidden");
}

function closeModal() {
  $("borrowModal").classList.add("hidden");
}

function renderBooks(list) {
  const grid = $("bookGrid");
  if (!grid) return;

  if (!list || list.length === 0) {
    grid.innerHTML = "";
    setStatus("Tidak ada buku.");
    return;
  }

  setStatus("");
  grid.innerHTML = list
    .map((book) => {
      const available = Number(book.stock) > 0;

      return `
        <div class="card">
          <div class="thumb">📘</div>
          <h3>${escapeHtml(book.title)}</h3>
          <p class="meta">Oleh: ${escapeHtml(book.author)}</p>

          <div class="badges">
            <span class="badge ${available ? "ok" : "no"}">
              ${available ? "✓ Tersedia" : "✗ Habis"}
            </span>
            <span class="badge">Stock: ${book.stock}</span>
          </div>

          <button class="btn primary" data-action="borrow" data-id="${book.id}" ${
        available ? "" : "disabled"
      }>
            📚 Pinjam Buku
          </button>
        </div>
      `;
    })
    .join("");

  // tombol pinjam per card
  grid.querySelectorAll('button[data-action="borrow"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id"));
      const book = allBooks.find((b) => Number(b.id) === id);
      if (book) openModal(book);
    });
  });
}

function filterBooks(query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return allBooks;

  return allBooks.filter((b) => {
    const title = String(b.title || "").toLowerCase();
    const author = String(b.author || "").toLowerCase();
    return title.includes(q) || author.includes(q);
  });
}

async function loadBooks() {
  try {
    setStatus("Memuat daftar buku...");
    const res = await fetch(`${API_BASE}/books`);
    const json = await res.json();

    if (!json.success) {
      allBooks = [];
      renderBooks([]);
      setStatus(json.message || "Gagal load buku.");
      return;
    }

    allBooks = json.data || [];
    const q = $("searchInput")?.value || "";
    renderBooks(filterBooks(q));
  } catch (e) {
    console.log("❌ loadBooks error:", e);
    setStatus("Error koneksi server.");
  }
}

async function borrowBook() {
  const userId = getUserId();
  const bookId = Number($("bookId").value);
  const latitude = Number($("latitude").value);
  const longitude = Number($("longitude").value);

  setBorrowStatus("");

  if (!Number.isInteger(bookId) || bookId <= 0) {
    setBorrowStatus("Book ID tidak valid.");
    return;
  }
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    setBorrowStatus("Latitude & Longitude harus angka (boleh desimal).");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/borrow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-role": "user",
        "x-user-id": String(userId),
      },
      body: JSON.stringify({ bookId, latitude, longitude }),
    });

    const json = await res.json();
    if (!json.success) {
      setBorrowStatus(json.message || "Gagal meminjam buku.");
      return;
    }

    setBorrowStatus("✅ Berhasil meminjam buku!");
    await loadBooks();
    setTimeout(closeModal, 600);
  } catch (e) {
    console.log("❌ borrowBook error:", e);
    setBorrowStatus("Error server saat meminjam buku.");
  }
}

function autoLocation() {
  setBorrowStatus("");

  if (!navigator.geolocation) {
    setBorrowStatus("Browser tidak support geolocation. Isi manual lat/long.");
    return;
  }

  setBorrowStatus("Mengambil lokasi...");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      $("latitude").value = String(pos.coords.latitude);
      $("longitude").value = String(pos.coords.longitude);
      setBorrowStatus("📍 Lokasi berhasil diambil. Klik Pinjam Buku.");
    },
    () => {
      setBorrowStatus("Gagal ambil lokasi. Aktifkan izin lokasi.");
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

window.addEventListener("DOMContentLoaded", () => {
  // binding event
  $("searchInput")?.addEventListener("input", (e) => {
    renderBooks(filterBooks(e.target.value));
  });

  $("closeModalBtn")?.addEventListener("click", closeModal);
  $("borrowBtn")?.addEventListener("click", borrowBook);
  $("autoLocBtn")?.addEventListener("click", autoLocation);

  $("borrowModal")?.addEventListener("click", (e) => {
    if (e.target.id === "borrowModal") closeModal();
  });

  // load buku pertama kali
  loadBooks();
});
