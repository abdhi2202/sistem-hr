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

### A. Halaman Login
Halaman utama autentikasi untuk seluruh pengguna sistem.

| Halaman | Keterangan | Screenshot |
|---------|------------|------------|
| **Login** | Form masuk sistem. Secara default form akan kosong untuk keamanan. | ![Login](docs/screenshots/login.png) |

### B. Tampilan Admin HR
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
   * **Admin HR:** `admin@ssms.test` / Password: `password`
   * **Karyawan:** `rina.paramita@ssms.test` / Password: `password`

---

## 🌐 Dokumentasi API & Endpoints (Singkat)

Seluruh endpoint API berada dalam prefix `/api`. Gunakan Header `Authorization: Bearer <token>` untuk endpoint yang dilindungi.

### 1. Autentikasi
*   **POST** `/api/login`: Login untuk mendapatkan Bearer Token.
    *   Body: `{"email": "admin@ssms.test", "password": "password"}`
*   **POST** `/api/logout`: Menghapus sesi aktif.

### 2. Absensi (Semua Role)
*   **POST** `/api/absensi/clock-in`: Mencatat waktu masuk.
*   **POST** `/api/absensi/clock-out`: Mencatat waktu keluar.
*   **GET** `/api/absensi/riwayat`: Mengambil histori absensi (terfilter otomatis sesuai role).

### 3. Pengajuan Cuti
*   **POST** `/api/cuti/ajukan`: Karyawan membuat pengajuan cuti baru.
*   **GET** `/api/cuti`: Melihat riwayat/daftar pengajuan cuti.
*   **POST** `/api/cuti/approve/{id}`: (Admin Only) Menyetujui atau menolak cuti.

### 4. Manajemen & Master Data (Khusus Admin HR)
*   **GET/POST/PUT/DELETE** `/api/karyawan`: Operasi CRUD data karyawan.
*   **GET/POST/PUT/DELETE** `/api/departemen` & `/api/jabatan`: Operasi CRUD data master.
*   **GET** `/api/export/karyawan`: Mengunduh CSV data karyawan.
*   **GET** `/api/export/absensi`: Mengunduh CSV rekap absensi.

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

## 🧪 Pengujian (Testing)

Proyek ini dilengkapi dengan suite pengujian otomatis untuk memastikan kualitas kode dan fungsionalitas fitur utama terjaga dengan baik (Reliability).

### 1. Jenis Pengujian
*   **Unit Test**: Menguji logika bisnis terkecil secara terisolasi. 
    *   *Contoh:* `Tests\Unit\Helpers\DateHelperTest` menguji fungsi pemformatan tanggal Indonesia.
*   **Feature/Integration Test**: Menguji alur fitur secara *end-to-end* (Endpoint -> Controller -> Database -> Response).
    *   *Cakupan:* Autentikasi (Login/Logout), Role-Based Access (Admin vs Employee), Alur Absensi (Clock-in/out), dan Alur Pengajuan Cuti (Submit/Approve).

### 2. Cara Menjalankan Pengujian
Pastikan Anda berada di direktori `sistem-hr-backend`, lalu jalankan:
```bash
php artisan test
```

### 3. Hasil Pengujian
Sistem saat ini memiliki **16 Test** (46 Assertions) yang mencakup seluruh poin kritikal aplikasi, semuanya dalam kondisi **PASS**.

---
*Dibuat oleh Muhammad Abdhi Priyatama.*
