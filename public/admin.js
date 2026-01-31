// public/admin.js
console.log("✅ admin.js loaded");

const BOOKS_API = "/api/books";
const LOGS_API = "/api/borrow/logs";

function $(id) { return document.getElementById(id); }

function token() {
  return localStorage.getItem("adminToken");
}

function authHeaders(extra = {}) {
  return {
    Authorization: `Bearer ${token()}`,
    ...extra,
  };
}

function setAdminMsg(msg) {
  const el = $("adminMsg");
  if (el) el.textContent = msg || "";
}

function setEditMsg(msg) {
  const el = $("editMsg");
  if (el) el.textContent = msg || "";
}

// ======================
// BOOKS CRUD (ADMIN)
// ======================
async function loadBooks() {
  const tbody = $("bookTable");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="5">Loading...</td></tr>`;

  try {
    const res = await fetch(BOOKS_API); // public endpoint
    const json = await res.json();

    if (!json.success) {
      tbody.innerHTML = `<tr><td colspan="5">Gagal load buku</td></tr>`;
      return;
    }

    const books = json.data || [];
    if (books.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">Belum ada buku</td></tr>`;
      return;
    }

    tbody.innerHTML = "";
    books.forEach((b) => {
      tbody.innerHTML += `
        <tr>
          <td>${b.id}</td>
          <td>${b.title}</td>
          <td>${b.author}</td>
          <td>${b.stock}</td>
          <td>
            <button class="btn secondary" data-edit="${b.id}">✏️</button>
            <button class="btn secondary" data-del="${b.id}">🗑</button>
          </td>
        </tr>
      `;
    });

    tbody.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.getAttribute("data-edit"));
        const book = books.find(x => Number(x.id) === id);
        if (book) openEditModal(book);
      });
    });

    tbody.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.getAttribute("data-del"));
        deleteBook(id);
      });
    });

  } catch (e) {
    console.log("❌ loadBooks error:", e);
    tbody.innerHTML = `<tr><td colspan="5">Error server</td></tr>`;
  }
}

async function addBook() {
  const title = $("title")?.value?.trim();
  const author = $("author")?.value?.trim();
  const stock = Number($("stock")?.value);

  setAdminMsg("");

  if (!title || !author) return setAdminMsg("❌ Judul & Penulis wajib diisi.");
  if (!Number.isInteger(stock) || stock < 0) return setAdminMsg("❌ Stok harus angka >= 0.");

  try {
    const res = await fetch(BOOKS_API, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ title, author, stock }),
    });

    const json = await res.json();

    if (!json.success) {
      // kalau token invalid, lempar balik ke login
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "login.html";
        return;
      }
      return setAdminMsg("❌ " + (json.message || "Gagal tambah buku"));
    }

    setAdminMsg("✅ Buku berhasil ditambahkan.");
    $("title").value = "";
    $("author").value = "";
    $("stock").value = "";

    await loadBooks();
  } catch (e) {
    console.log("❌ addBook error:", e);
    setAdminMsg("❌ Error server saat tambah buku.");
  }
}

async function deleteBook(id) {
  if (!confirm("Yakin hapus buku ini?")) return;

  try {
    const res = await fetch(`${BOOKS_API}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    const json = await res.json();

    if (!json.success) {
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "login.html";
        return;
      }
      alert(json.message || "Gagal hapus buku");
      return;
    }

    await loadBooks();
  } catch (e) {
    console.log("❌ deleteBook error:", e);
    alert("Error server");
  }
}

// ======================
// EDIT MODAL
// ======================
function openEditModal(book) {
  $("editId").value = book.id;
  $("editTitle").value = book.title;
  $("editAuthor").value = book.author;
  $("editStock").value = book.stock;
  setEditMsg("");
  $("editModal").classList.remove("hidden");
}

function closeEditModal() {
  $("editModal").classList.add("hidden");
}

async function updateBook() {
  const id = Number($("editId").value);
  const title = $("editTitle").value.trim();
  const author = $("editAuthor").value.trim();
  const stock = Number($("editStock").value);

  setEditMsg("");

  if (!title || !author) return setEditMsg("❌ Judul & Penulis wajib diisi.");
  if (!Number.isInteger(stock) || stock < 0) return setEditMsg("❌ Stok harus angka >= 0.");

  try {
    const res = await fetch(`${BOOKS_API}/${id}`, {
      method: "PUT",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ title, author, stock }),
    });

    const json = await res.json();

    if (!json.success) {
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "login.html";
        return;
      }
      return setEditMsg("❌ " + (json.message || "Gagal update"));
    }

    setEditMsg("✅ Berhasil update.");
    await loadBooks();
    closeEditModal();
  } catch (e) {
    console.log("❌ updateBook error:", e);
    setEditMsg("❌ Error server saat update.");
  }
}

// ======================
// BORROW LOGS (ADMIN)
// ======================
async function loadBorrowLogs() {
  const tbody = $("borrowLogTable");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="8">Loading...</td></tr>`;

  try {
    const res = await fetch(LOGS_API, { headers: authHeaders() });
    const json = await res.json();

    if (!json.success) {
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "login.html";
        return;
      }
      tbody.innerHTML = `<tr><td colspan="8">Gagal load borrow logs: ${json.message || ""}</td></tr>`;
      return;
    }

    const logs = json.data || [];
    if (logs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8">Belum ada peminjaman</td></tr>`;
      return;
    }

    tbody.innerHTML = "";
    logs.forEach((log) => {
      const book = log.Book || {};
      const dateStr = log.borrowDate ? new Date(log.borrowDate).toLocaleString() : "-";

      tbody.innerHTML += `
        <tr>
          <td>${log.id}</td>
          <td>${log.userId}</td>
          <td>${log.bookId}</td>
          <td>${book.title || "-"}</td>
          <td>${book.author || "-"}</td>
          <td>${dateStr}</td>
          <td>${log.latitude ?? "-"}</td>
          <td>${log.longitude ?? "-"}</td>
        </tr>
      `;
    });

  } catch (e) {
    console.log("❌ loadBorrowLogs error:", e);
    tbody.innerHTML = `<tr><td colspan="8">Gagal load borrow logs (server error)</td></tr>`;
  }
}

// ======================
// INIT
// ======================
window.addEventListener("DOMContentLoaded", async () => {
  // logout
  $("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("adminToken");
    window.location.href = "login.html";
  });

  // form add
  $("saveBtn")?.addEventListener("click", addBook);
  $("resetBtn")?.addEventListener("click", () => {
    $("title").value = "";
    $("author").value = "";
    $("stock").value = "";
    setAdminMsg("");
  });

  // modal edit bind
  $("closeEditModalBtn")?.addEventListener("click", closeEditModal);
  $("cancelBtn")?.addEventListener("click", closeEditModal);
  $("updateBtn")?.addEventListener("click", updateBook);
  $("editModal")?.addEventListener("click", (e) => {
    if (e.target.id === "editModal") closeEditModal();
  });

  await loadBooks();
  await loadBorrowLogs();
});
