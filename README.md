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
# Untuk backend lokal:
# VITE_DATA_SOURCE=http
# VITE_API_BASE_URL=http://localhost:8000

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

## Panduan Deployment

Project ini sekarang direkomendasikan untuk dideploy dengan arsitektur berikut:

* **Frontend**: `sistem-hr` di-deploy ke **Vercel**
* **Backend API**: `sistem-hr-backend` di-deploy ke **Render**
* **Database**: PostgreSQL terkelola di **Render**

Panduan di bawah ini mengikuti konfigurasi yang memang dipakai repository ini saat ini.

### 1. Gambaran Arsitektur Deployment

Alur request production:

1. User membuka frontend React di domain Vercel
2. Frontend memanggil backend Laravel di Render
3. Backend Laravel terhubung ke database PostgreSQL Render
4. Autentikasi dilakukan melalui Bearer token API

Contoh domain production:

* Frontend: `https://sistem-hr-perusahaan.vercel.app`
* Backend: `https://sistem-hr-api.onrender.com`

### 2. Persiapan Sebelum Deploy

Sebelum mulai, pastikan:

* repository sudah ter-push ke GitHub
* file `render.yaml` di root repository sudah ikut ter-push
* frontend bisa di-build dengan `npm run build`
* backend bisa di-build dan dijalankan secara lokal
* akun Render dan Vercel sudah aktif

Akun demo bawaan seeder untuk pengujian:

* **Admin HR**: `admin@ssms.test` / `password`
* **Karyawan**: `rina.paramita@ssms.test` / `password`

### 3. Deploy Backend Laravel ke Render

Backend menggunakan Docker dan blueprint Render yang sudah tersedia di file `render.yaml`.

#### A. Import Repository ke Render

1. Login ke [Render](https://render.com)
2. Klik **New** lalu pilih **Blueprint**
3. Hubungkan repository GitHub ini
4. Pilih repository `sistem-hr-perusahaan`
5. Render akan membaca file `render.yaml` dari root repository

#### B. Resource yang Akan Dibuat oleh Blueprint

Blueprint akan membuat:

* 1 PostgreSQL database bernama `sistem-hr-db`
* 1 web service Docker bernama `sistem-hr-api`

Konfigurasi penting yang sudah diset di `render.yaml`:

* database region: `singapore`
* web service region: `singapore`
* backend root directory: `sistem-hr-backend`
* health check backend: `/up`
* database dihubungkan ke Laravel melalui `DB_URL`

#### C. Hal Penting Tentang Region Database

Database Render **harus** berada di region yang sama dengan web service.

Untuk project ini:

* database: `singapore`
* web service: `singapore`

Jika region database berbeda, backend bisa gagal start dengan error seperti:

```text
could not translate host name "...dpg..." to address
```

Jika database telanjur dibuat di region yang salah:

1. backup data jika ada data penting
2. hapus resource database lama di Render
3. jalankan **Manual Sync** pada Blueprint
4. biarkan Render membuat ulang database sesuai `render.yaml`

Catatan: region database Render tidak bisa diedit langsung setelah database dibuat.

#### D. Environment Variable Backend di Render

Sebagian besar env backend sudah dikelola blueprint. Nilai penting yang dipakai project ini:

* `APP_ENV=production`
* `APP_DEBUG=false`
* `APP_ENABLE_DEMO_SEED=true`
* `DB_CONNECTION=pgsql`
* `DB_URL` diambil otomatis dari database Render
* `DB_SSLMODE=require`
* `SESSION_DRIVER=database`
* `CACHE_STORE=database`
* `QUEUE_CONNECTION=database`
* `CORS_ALLOWED_ORIGINS` berisi domain frontend Vercel
* `CORS_ALLOWED_ORIGINS_PATTERNS` mengizinkan domain `*.vercel.app`

Jika domain frontend production Anda berubah, update juga `CORS_ALLOWED_ORIGINS` di `render.yaml` lalu sync ulang Blueprint.

#### E. Proses Deploy Backend

Setelah Blueprint selesai dibuat:

1. buka resource `sistem-hr-api`
2. tunggu proses build Docker selesai
3. pastikan status service menjadi **Live**
4. buka URL health check:

```text
https://sistem-hr-api.onrender.com/up
```

Jika backend sehat, Anda akan melihat status **Application up**.

#### F. Verifikasi Backend dengan Postman

Sebelum menghubungkan frontend, uji backend lebih dulu.

Request login:

* Method: `POST`
* URL: `https://sistem-hr-api.onrender.com/api/login`
* Header:
  * `Content-Type: application/json`
  * `Accept: application/json`
* Body:

```json
{
  "email": "admin@ssms.test",
  "password": "password"
}
```

Jika berhasil, backend akan mengembalikan token dan data user.

### 4. Deploy Frontend React ke Vercel

Frontend berada di folder `sistem-hr` dan sudah dilengkapi `vercel.json` untuk kebutuhan SPA routing.

#### A. Import Repository ke Vercel

1. Login ke [Vercel](https://vercel.com)
2. Klik **Add New** lalu pilih **Project**
3. Import repository `sistem-hr-perusahaan`

#### B. Isi Konfigurasi Project

Saat form konfigurasi muncul, gunakan nilai berikut:

* **Root Directory**: `sistem-hr`
* **Framework Preset**: `Vite`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Install Command**: biarkan default / kosong

#### C. Environment Variable Frontend di Vercel

Tambahkan env berikut pada project frontend:

* `VITE_DATA_SOURCE=http`
* `VITE_API_BASE_URL=https://sistem-hr-api.onrender.com`
* `VITE_API_TIMEOUT_MS=10000`

Catatan penting:

* `VITE_API_BASE_URL` **tidak perlu** ditambah `/api`
* frontend project ini sudah menambahkan prefix `/api` sendiri di layer endpoint
* jika Anda mengisi `https://.../api`, request frontend akan menjadi ganda atau salah path

#### D. Deploy Frontend

Setelah konfigurasi diisi:

1. klik **Deploy**
2. tunggu proses build selesai
3. buka domain Vercel yang diberikan

Saat pertama kali dibuka, aplikasi seharusnya masuk ke halaman `/login`.

### 5. Menghubungkan Frontend dan Backend

Agar frontend benar-benar memakai backend live:

* `VITE_DATA_SOURCE` harus `http`
* `VITE_API_BASE_URL` harus mengarah ke domain Render backend

Setelah env diubah di Vercel, lakukan **redeploy** frontend agar env baru benar-benar masuk ke build production.

### 6. Urutan Deploy yang Paling Aman

Urutan deploy yang direkomendasikan:

1. push code terbaru ke GitHub
2. deploy backend ke Render
3. pastikan backend lolos health check `/up`
4. tes login backend via Postman
5. deploy frontend ke Vercel
6. buka frontend di tab incognito
7. login dengan akun demo

Alasan urutan ini:

* frontend production akan gagal login jika backend belum live
* masalah CORS lebih mudah didiagnosis jika backend sudah terverifikasi lebih dulu

### 7. Verifikasi Setelah Deploy

Lakukan pengecekan berikut setelah frontend dan backend online:

#### A. Cek Backend

1. buka `https://sistem-hr-api.onrender.com/up`
2. pastikan muncul status **Application up**
3. tes `POST /api/login` di Postman

#### B. Cek Frontend

1. buka frontend Vercel
2. pastikan halaman awal adalah login
3. login dengan akun demo admin
4. pastikan dashboard termuat
5. buka modul `Karyawan`, `Master`, `Absensi`, dan `Cuti`

#### C. Cek Network di Browser

Jika perlu, buka DevTools browser lalu tab **Network**, kemudian pastikan request frontend benar-benar menuju:

```text
https://sistem-hr-api.onrender.com/api/...
```

Bukan ke:

```text
http://localhost:8000
```

### 8. Troubleshooting Umum

#### A. Backend Render gagal start karena database host tidak ditemukan

Gejala:

```text
could not translate host name "...dpg..."
```

Penyebab umum:

* database dan web service tidak berada di region Render yang sama

Solusi:

1. cek region database
2. jika salah region, hapus database lama
3. jalankan **Manual Sync** pada Blueprint
4. deploy ulang backend

#### B. Frontend Vercel tampil, tetapi login gagal dengan pesan tidak dapat terhubung ke server

Penyebab umum:

* `VITE_API_BASE_URL` salah
* backend belum live
* backend CORS belum mengizinkan domain frontend

Solusi:

1. pastikan `VITE_API_BASE_URL=https://sistem-hr-api.onrender.com`
2. pastikan backend `/up` sehat
3. pastikan `CORS_ALLOWED_ORIGINS` di Render mencakup domain Vercel
4. redeploy backend setelah mengubah env atau `render.yaml`

#### C. Frontend langsung masuk dashboard tanpa login

Penyebab umum:

* browser masih menyimpan session lama di `localStorage`

Solusi:

1. buka tab incognito
2. atau hapus key `sistem-hr-session` dari `localStorage`
3. refresh halaman

#### D. Login di Postman berhasil, tetapi login di browser gagal

Penyebab umum:

* masalah CORS di backend

Catatan:

* Postman tidak mewakili pembatasan CORS browser
* browser selalu mengirim `Origin` saat cross-origin request

### 9. Catatan Konfigurasi Project Ini

Hal yang spesifik untuk repository ini:

* frontend memakai `VITE_DATA_SOURCE` untuk memilih mode `mock` atau `http`
* frontend production harus memakai `VITE_DATA_SOURCE=http`
* frontend memakai `VITE_API_BASE_URL` tanpa suffix `/api`
* backend memakai Laravel Sanctum dengan token Bearer
* backend production memakai PostgreSQL Render
* backend startup akan menjalankan migration otomatis
* backend dapat mengisi data demo jika `APP_ENABLE_DEMO_SEED=true`
* `render.yaml` adalah sumber konfigurasi utama deploy backend

### 10. Ringkasan Cepat

Jika ingin jalur paling ringkas:

1. push repository ke GitHub
2. deploy Blueprint di Render dari file `render.yaml`
3. pastikan database dan web service sama-sama di region `singapore`
4. cek backend di `/up`
5. tes login backend di Postman
6. deploy frontend `sistem-hr` ke Vercel
7. isi env frontend:
   * `VITE_DATA_SOURCE=http`
   * `VITE_API_BASE_URL=https://sistem-hr-api.onrender.com`
   * `VITE_API_TIMEOUT_MS=10000`
8. buka frontend dan login dengan akun demo

---
*Dibuat oleh Muhammad Abdhi Priyatama.*
