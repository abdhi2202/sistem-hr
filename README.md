# Sistem Manajemen HR (HRMS) Perusahaan

Sistem Manajemen HR adalah aplikasi fullstack (React.js + Laravel) yang dibangun untuk mengelola operasional HR internal perusahaan, mencakup manajemen karyawan, absensi, cuti, dan master data. Proyek ini memisahkan arsitektur backend sebagai penyedia REST API dan frontend sebagai Single Page Application (SPA).

---

## 🎯 Fitur Utama

- **Authentication & Authorization**: Login berbasis JWT (menggunakan Laravel Sanctum) dengan pemisahan Hak Akses (Role-Based Access Control).
- **Dashboard Statistik**: Menampilkan ringkasan total karyawan, karyawan aktif, absensi hari ini, dan jumlah cuti yang *pending*.
- **Manajemen Karyawan**: CRUD (Create, Read, Update, Delete) karyawan, pencarian, dan filter berdasarkan departemen.
- **Master Data**: Pengelolaan departemen dan jabatan perusahaan.
- **Modul Absensi**: Fasilitas *Clock-in* dan *Clock-out* harian beserta pencatatan riwayat absensi.
- **Modul Cuti**: Karyawan dapat mengajukan permohonan cuti, dan Admin dapat melakukan validasi (*Approve/Reject*).
- **Ekspor Data**: Fungsionalitas mengunduh rekap data karyawan dan absensi dalam format CSV.

---

## 📸 Dokumentasi & Screenshot

### A. Tampilan Admin HR
Digunakan oleh pengguna dengan peran `admin_hr` untuk manajemen seluruh data operasional perusahaan.

| Halaman | Keterangan | Screenshot |
|---------|------------|------------|
| **Dashboard Admin** | Ringkasan statistik operasional, jumlah karyawan, dan status cuti/absensi global. | ![Admin Dashboard](docs/screenshots/admin-dashboard.png) |
| **Manajemen Karyawan** | Daftar karyawan lengkap dengan fitur CRUD, pencarian, dan filter departemen. | ![Admin Karyawan](docs/screenshots/admin-karyawan.png) |
| **Master Data** | Pengelolaan data statis seperti Departemen dan Jabatan untuk struktur organisasi. | ![Admin Master](docs/screenshots/admin-master.png) |

### B. Tampilan Karyawan
Tampilan yang dipersonalisasi untuk peran `karyawan` guna mempermudah aktivitas administrasi harian secara mandiri.

| Halaman | Keterangan | Screenshot |
|---------|------------|------------|
| **Dashboard Karyawan** | Selamat datang personal dan ringkasan riwayat absensi terbaru milik pribadi. | ![Employee Dashboard](docs/screenshots/emp-dashboard.png) |
| **Absensi Mandiri** | Antarmuka khusus untuk melakukan *Clock-in* dan *Clock-out* harian. | ![Employee Absensi](docs/screenshots/emp-absensi.png) |
| **Pengajuan Cuti** | Form permohonan cuti dan pemantauan status persetujuan dari pihak HR. | ![Employee Cuti](docs/screenshots/emp-cuti.png) |

---

## 🛠 Instalasi & Setup

Sistem ini terbagi menjadi dua bagian: **Backend (Laravel)** dan **Frontend (React)**. Pastikan PHP >= 8.2, Composer, Node.js, dan MySQL/PostgreSQL telah terinstall.

### 1. Setup Backend (Laravel)
Buka terminal dan jalankan perintah berikut:
```bash
# Masuk ke direktori backend
cd sistem-hr-backend

# Install dependensi PHP
composer install

# Salin file environment dan atur koneksi database
cp .env.example .env

# Generate application key
php artisan key:generate

# Lakukan migrasi database beserta data awal (Seeder)
# Pastikan database yang tercantum di .env sudah dibuat sebelumnya di MySQL/PostgreSQL Anda
php artisan migrate --seed

# Jalankan server development
php artisan serve
```
*Backend akan berjalan secara default di `http://localhost:8000`.*

### 2. Setup Frontend (React + Vite)
Buka terminal baru dan jalankan perintah berikut:
```bash
# Masuk ke direktori frontend
cd sistem-hr

# Install dependensi node modules
npm install

# Setup environment (sesuaikan URL backend jika perlu)
cp .env.example .env
# Isi VITE_API_URL=http://localhost:8000/api di .env Anda

# Jalankan development server
npm run dev
```
*Frontend akan berjalan secara default di `http://localhost:5173`.*

---

## 🚀 Cara Menjalankan Aplikasi
1. Nyalakan service database Anda (misal: MySQL melalui XAMPP atau Docker).
2. Start server Backend Laravel dengan `php artisan serve`.
3. Start server Frontend React dengan `npm run dev`.
4. Buka browser dan arahkan ke alamat URL Frontend (umumnya `http://localhost:5173`).
5. **Akun Uji Coba Default (berdasarkan Seeder):**
   * **Admin HR:** `admin@perusahaan.com` / Password: `password`
   * **Karyawan:** `karyawan@perusahaan.com` / Password: `password`

---

## 🌐 Contoh Penggunaan API & Endpoints

Seluruh endpoint API berada dalam prefix `/api`. Sebagian besar endpoint dilindungi oleh Middleware, yang berarti Anda harus menyertakan Header `Authorization: Bearer <token>`.

### 1. Autentikasi Login
* **URL:** `/api/login` | **Method:** `POST`
* **Body:**
  ```json
  {
    "email": "admin@perusahaan.com",
    "password": "password"
  }
  ```
* **Response (Success):** Membawa Bearer token yang digunakan untuk mengakses endpoint lain.

### 2. Melakukan Clock-in (Karyawan)
* **URL:** `/api/absensi/clock-in` | **Method:** `POST`
* **Headers:** `Authorization: Bearer {token}`
* **Response (Success):** Status berhasil mencatat waktu masuk hari ini.

### 3. Mengambil Data Karyawan (Admin HR)
* **URL:** `/api/karyawan` | **Method:** `GET`
* **Headers:** `Authorization: Bearer {token}`
* **Response:** Array of objects berisi data master karyawan lengkap dengan informasi relasi departemen & jabatan.

---

## 🔐 Pemahaman Penggunaan Role-Based Access Control (RBAC)

Sistem ini didesain menggunakan **2 Role Utama**:
1. **Admin HR (`admin_hr`)**: Memiliki izin tak terbatas ke master data, mengatur karyawan, melihat seluruh rangkuman absensi, dan menyetujui pengajuan cuti.
2. **Karyawan (`karyawan`)**: Hanya dapat menulis absensi untuk dirinya sendiri, mengecek rekap pribadinya, dan mengajukan cuti.


### A. Implementasi Role Pada Backend (Laravel)
Di Laravel, pengecekan role dilakukan menggunakan **Middleware**. Jangan pernah memvalidasi izin hanya di sisi frontend.

* **Cara Menerapkannya:** Saat kamu mendaftarkan route baru di `routes/api.php`, kamu dapat memagari route tersebut khusus untuk admin dengan menempelkan middleware check-role.
* **Contoh Kode Route:**
  ```php
  // Hanya bisa diakses oleh role "admin_hr"
  Route::middleware(['auth:sanctum', 'role:admin_hr'])->group(function () {
      Route::apiResource('jabatan', JabatanController::class);
      Route::apiResource('departemen', DepartemenController::class);
  });
  
  // Bisa diakses oleh siapapun yang login, Controller yang akan menyaring data datanya berdasarkan Role User 
  Route::middleware('auth:sanctum')->group(function () {
      Route::get('absensi/riwayat', [AbsensiController::class, 'riwayat']);
  });
  ```
* **Catatan Penting:** Pada Route yang bisa diakses bersama (misal GET Cuti), kamu harus melakukan pengecekan `auth()->user()->role` di Level Controller. Jika dia `admin_hr`, `Query`-kan seluruh data. Jika dia `karyawan`, tambahkan klausa `where('karyawan_id', auth()->user()->karyawan->id)`.

### B. Implementasi Role Pada Frontend (React)
Di frontend, validasi Role bertujuan untuk memanipulasi User Interface (menyembunyikan tombol, memblokir halaman) agar User Experience lebih baik.

* **Penyimpanan State:** Setelah `/login` berhasil, API akan mengembalikan data berupa `token`, `user`, dan `role`. Simpan informasi ini di *Context API* (atau Zustand) maupun `localStorage`.
* **Menyembunyikan Komponen Tertentu (Conditional Rendering):**
  Untuk mencegah Karyawan memencet tombol "Hapus", periksa role-nya di komponen bersangkutan.
  ```jsx
  // Contoh Penggunaan
  import { useAuth } from '../context/AuthContext';

  function KaryawanTable() {
    const { user } = useAuth(); // asumsikan user memiliki atribut role

    return (
      <div>
        {/* Tombol hanya muncul jika role adalah admin_hr */}
        {user.role === 'admin_hr' && (
          <button className="bg-blue-500 text-white">Tambah Karyawan</button>
        )}
      </div>
    );
  }
  ```
* **Membatasi Akses Halaman (Protected Routes):**
  Kamu wajib membungkus rute yang spesifik pada Router menggunakan Wrapper pelindung.
  ```jsx
  <Route 
    path="/master-jabatan" 
    element={
      <RequireRole allowedRoles={['admin_hr']}>
        <MasterJabatanPage />
      </RequireRole>
    } 
  />
  ```
  Komponen `<RequireRole />` bertugas mengecek apabila state role saat ini bukanlah `admin_hr`, maka akan me-return user untuk berpindah halaman via `<Navigate to="/403" />` atau kembali ke Dashboard.

---
*Dibuat oleh Muhammad Abdhi Priyatama.*
