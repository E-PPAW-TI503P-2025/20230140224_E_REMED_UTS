# 20230140224_E_REMED_UTS

# 📚 Library System (UTS Remedial PAW)

Sistem manajemen perpustakaan sederhana yang mencakup fungsionalitas Backend (API) dan Frontend. Project ini mendukung manajemen buku bagi admin dan simulasi peminjaman bagi user dengan fitur Geolocation.

---

## 🚀 Fitur Utama

- **🔐 Admin Authentication:** Login menggunakan JWT (JSON Web Token).
- **📋 Admin Dashboard:** Protected route untuk mengelola data buku.
- **📚 CRUD Buku:** Create, Read, Update, dan Delete data buku (khusus Admin).
- **📍 Peminjaman & Geolocation:** User dapat meminjam buku dengan mencatat lokasi (Latitude/Longitude).
- **📝 Borrow Logs:** Riwayat peminjaman buku yang dapat dipantau oleh admin.

---

## 🛠️ Teknologi yang Digunakan

| Komponen | Teknologi |
| --- | --- |
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **ORM** | Sequelize |
| **Database** | MySQL |
| **Frontend** | HTML5, CSS3, JavaScript (Fetch API & LocalStorage) |

---

## 📦 Instalasi & Persiapan

1. **Clone & Install**
   ```bash
   npm install

```

2. **Konfigurasi Database**
* Pastikan MySQL aktif.
* Buat database baru: `CREATE DATABASE library_system_db;`
* Sesuaikan kredensial database (username & password) di file `config/database.js`.


3. **Menjalankan Server**
```bash
node app.js

```


Akses aplikasi di: `http://localhost:3000`

---

## 🗄️ Struktur Tabel Database

Project ini menggunakan 3 tabel utama:

* **Admins**: Menyimpan kredensial admin (Password di-hash).
* **Books**: Menyimpan daftar judul, penulis, dan stok buku.
* **BorrowLogs**: Mencatat siapa meminjam apa, kapan, dan dari mana (koordinat).

---

## 📡 Endpoint API (Dokumentasi)

### 1. Authentication (Admin)

| Method | Endpoint | Fungsi | Body |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Daftar akun admin baru | `username`, `password` |
| `POST` | `/api/auth/login` | Login & dapatkan token | `username`, `password` |

### 2. Books Management

| Method | Endpoint | Akses | Fungsi |
| --- | --- | --- | --- |
| `GET` | `/api/books` | Public | Ambil semua daftar buku |
| `POST` | `/api/books` | Admin | Tambah buku baru (Bearer Token) |
| `PUT` | `/api/books/:id` | Admin | Update data buku (Bearer Token) |
| `DELETE` | `/api/books/:id` | Admin | Hapus buku (Bearer Token) |

### 3. Borrowing (Peminjaman)

| Method | Endpoint | Header | Fungsi |
| --- | --- | --- | --- |
| `POST` | `/api/borrow` | `x-user-id` | Pinjam buku (Input: `bookId`, `lat`, `long`) |
| `GET` | `/api/borrow/logs` | Admin | Lihat log peminjaman (Bearer Token) |

---

## 🖥️ Tampilan Frontend
Halaman utama untuk pengunjung (Lihat buku & Pinjam)
<img width="1919" height="816" alt="Screenshot 2026-01-31 105020" src="https://github.com/user-attachments/assets/63e84c83-33cb-453b-b424-08ba1aa2dfae" />
tampilan pinjam buku 
<img width="1873" height="827" alt="Screenshot 2026-01-31 105035" src="https://github.com/user-attachments/assets/e1eb5b66-73e0-4175-a12d-147aa66a32d9" />
tampilan login masuk kehalaman admin
<img width="1902" height="847" alt="Screenshot 2026-01-31 195908" src="https://github.com/user-attachments/assets/effd6b30-de32-4391-bfb5-328f1ba82b6b" />
tampilan halaman dashboard admin 
<img width="1919" height="910" alt="Screenshot 2026-01-31 105050" src="https://github.com/user-attachments/assets/68f6c776-29ab-4f55-be96-ef1040eb7986" />
tampilan tambah stok buku 
<img width="1705" height="392" alt="Screenshot 2026-01-31 105210" src="https://github.com/user-attachments/assets/7471ff32-f996-48de-b90d-cb842e07693f" />
<img width="1750" height="435" alt="Screenshot 2026-01-31 105219" src="https://github.com/user-attachments/assets/6e844354-ea94-4412-8e1a-06d6d531b8a8" />
tampilan edit buku 
<img width="1769" height="761" alt="Screenshot 2026-01-31 105241" src="https://github.com/user-attachments/assets/06d2d1a4-6e1a-458a-b867-d027595d3702" />
hapus buku 
<img width="1919" height="902" alt="Screenshot 2026-01-31 105255" src="https://github.com/user-attachments/assets/3c140aab-c4d5-441d-b53e-62b1af1cd2b9" />
<img width="1914" height="880" alt="Screenshot 2026-01-31 105308" src="https://github.com/user-attachments/assets/d3f63412-484d-491b-b7f3-11a17ccff610" />

🧪 API Testing (Postman)

Tambah buku 
<img width="1445" height="880" alt="Screenshot 2026-01-30 150449" src="https://github.com/user-attachments/assets/bd515458-4d38-49b4-9675-07a1ffdf13da" />
lihat list buku 
<img width="1399" height="919" alt="Screenshot 2026-01-31 105649" src="https://github.com/user-attachments/assets/3274740f-c965-410b-95b0-ffc855e05b9b" />
update data 
<img width="1401" height="757" alt="Screenshot 2026-01-31 105836" src="https://github.com/user-attachments/assets/47665556-63ba-4a4d-8a30-006cf9c46979" />
hapus data 
<img width="1372" height="733" alt="Screenshot 2026-01-31 110804" src="https://github.com/user-attachments/assets/7d73d4cd-68f0-4a57-956c-7dd35a2f9e53" />
pinjam buku (user)
<img width="1367" height="875" alt="Screenshot 2026-01-31 111010" src="https://github.com/user-attachments/assets/c412a101-2a12-4d49-8af3-b653fad382bb" />
register admin
<img width="1437" height="820" alt="Screenshot 2026-01-31 195839" src="https://github.com/user-attachments/assets/1d0297d3-266a-4118-b854-fd2bd8f7d984" />

🗄️ Database Schema & Structure
<img width="1349" height="640" alt="image" src="https://github.com/user-attachments/assets/a7823548-948c-42f4-bcb2-2a6e1bd5a6f3" />
<img width="1222" height="462" alt="image" src="https://github.com/user-attachments/assets/2089c02f-2ab4-45b0-ae84-4d92a753b5ce" />
<img width="1303" height="526" alt="image" src="https://github.com/user-attachments/assets/73f73d53-cbb6-4122-bc21-e6eed85e6e0f" />









---

## ⚠️ Catatan Penting

* Pastikan header `Authorization: Bearer <token>` disertakan saat testing API Admin di Postman.
* Untuk simulasi user, header `x-user-id` digunakan sebagai pengganti sistem login user yang kompleks.



**Dibuat oleh:** Firyal shafa salsabila - UTS Remedial PAW


