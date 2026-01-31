// public/login.js
function $(id) { return document.getElementById(id); }
function setMsg(msg) { $("loginMsg").textContent = msg || ""; }

async function login() {
  const username = $("adminUser").value.trim();
  const password = $("adminPass").value.trim();

  if (!username || !password) {
    setMsg("❌ Username & Password wajib diisi");
    return;
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const json = await res.json();

    if (!json.success) {
      setMsg("❌ " + (json.message || "Login gagal"));
      return;
    }

    localStorage.setItem("adminToken", json.token);
    setMsg("✅ Login berhasil, menuju dashboard...");

    setTimeout(() => (window.location.href = "admin.html"), 500);
  } catch (e) {
    console.log("❌ login error:", e);
    setMsg("❌ Error server");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  $("loginBtn").addEventListener("click", login);

  $("adminPass").addEventListener("keydown", (e) => {
    if (e.key === "Enter") login();
  });
});
