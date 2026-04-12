# Sistem HR Frontend

Frontend `sistem-hr` dibangun dengan React + Vite + Material UI.

Status saat ini:
- UI utama sudah tersedia untuk `Login`, `Dashboard`, `Karyawan`, `Master Data`, `Absensi`, `Cuti`, dan `Profil`.
- Default aplikasi memakai sumber data `mock` berbasis `localStorage`.
- Struktur service sudah siap diganti ke mode `API` untuk backend Laravel.
- Blueprint backend Laravel tersedia di `docs/laravel-backend-blueprint.md`.
- Contoh request manual tersedia di `docs/laravel-api.http`.

## Menjalankan Project

1. Install dependensi:

```bash
npm install
```

2. Salin env:

```bash
cp .env.example .env
```

3. Jalankan dev server:

```bash
npm run dev
```

4. Build produksi:

```bash
npm run build
```

## Konfigurasi Env

File `.env.example`:

```env
VITE_DATA_SOURCE=mock
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT_MS=10000
```

Arti variabel:
- `VITE_DATA_SOURCE=mock`: frontend memakai mock data lokal.
- `VITE_DATA_SOURCE=http`: frontend memakai HTTP client ke backend.
- `VITE_API_BASE_URL`: base URL Laravel API.
- `VITE_API_TIMEOUT_MS`: timeout request dalam milidetik.

## Mode Data

### Mock
- Dipakai secara default.
- Data disimpan di `localStorage`.
- Cocok untuk eksplorasi UI tanpa backend.

### API
- Aktif jika `VITE_DATA_SOURCE=http`.
- Frontend memakai endpoint map, HTTP client, dan normalizer.
- Response backend boleh berupa array langsung atau format `{ data: [...] }` / `{ data: {...} }`.

## Struktur Integrasi

Lapisan utama:
- `src/services/api/config.js`: konfigurasi env.
- `src/services/api/endpoints.js`: peta endpoint Laravel.
- `src/services/api/client.js`: wrapper `fetch`.
- `src/services/api/normalizers.js`: mapper response Laravel ke shape frontend.
- `src/services/httpHrApi.js`: implementasi service berbasis HTTP.
- `src/services/hrApi.js`: implementasi service mock.
- `src/services/hrService.js`: factory untuk memilih `mock` atau `http`.
- `src/context/HrDataContext.jsx`: provider data yang dipakai seluruh halaman.

Dokumen pendamping:
- `docs/laravel-backend-blueprint.md`: contoh route, middleware, resource, request, dan response Laravel.
- `docs/laravel-api.http`: koleksi request siap pakai untuk uji endpoint secara manual.

## Kontrak Shape Frontend

Frontend saat ini mengonsumsi shape berikut.

### Employee

```json
{
  "id": 1,
  "nomorInduk": "EMP-001",
  "namaLengkap": "Rina Paramita",
  "email": "rina.paramita@ssms.test",
  "departemen": "Finance",
  "jabatan": "Senior Finance Officer",
  "tanggalBergabung": "2023-02-14",
  "statusAktif": true
}
```

### Department

```json
{
  "id": 1,
  "nama": "Finance",
  "penggunaan": 8
}
```

### Position

```json
{
  "id": 1,
  "nama": "HR Generalist",
  "penggunaan": 3
}
```

### Attendance

```json
{
  "id": 1,
  "nama": "Rina Paramita",
  "departemen": "Finance",
  "tanggal": "2026-04-12",
  "waktuMasuk": "07:58",
  "waktuKeluar": "17:06",
  "status": "Hadir"
}
```

### Leave

```json
{
  "id": 1,
  "nama": "Nadia Putri",
  "departemen": "People Ops",
  "tanggalMulai": "2026-04-20",
  "tanggalSelesai": "2026-04-21",
  "alasan": "Acara keluarga",
  "status": "Pending"
}
```

## Bentuk Response Laravel Yang Disarankan

Normalizers saat ini mendukung field `snake_case` dan relasi nested.

### GET `/api/karyawan`

```json
{
  "data": [
    {
      "id": 1,
      "nomor_induk": "EMP-001",
      "nama_lengkap": "Rina Paramita",
      "tanggal_bergabung": "2023-02-14",
      "status_aktif": true,
      "user": {
        "email": "rina.paramita@ssms.test"
      },
      "departemen": {
        "nama_departemen": "Finance"
      },
      "jabatan": {
        "nama_jabatan": "Senior Finance Officer"
      }
    }
  ]
}
```

### GET `/api/departemen`

```json
{
  "data": [
    {
      "id": 1,
      "nama_departemen": "Finance",
      "karyawan_count": 8
    }
  ]
}
```

### GET `/api/jabatan`

```json
{
  "data": [
    {
      "id": 1,
      "nama_jabatan": "HR Generalist",
      "karyawan_count": 3
    }
  ]
}
```

### GET `/api/absensi/riwayat`

```json
{
  "data": [
    {
      "id": 1,
      "tanggal": "2026-04-12",
      "waktu_masuk": "07:58",
      "waktu_keluar": "17:06",
      "status": "Hadir",
      "karyawan": {
        "nama_lengkap": "Rina Paramita",
        "departemen": {
          "nama_departemen": "Finance"
        }
      }
    }
  ]
}
```

### GET `/api/cuti`

```json
{
  "data": [
    {
      "id": 1,
      "tanggal_mulai": "2026-04-20",
      "tanggal_selesai": "2026-04-21",
      "alasan": "Acara keluarga",
      "status_pengajuan": "Pending",
      "karyawan": {
        "nama_lengkap": "Nadia Putri",
        "departemen": {
          "nama_departemen": "People Ops"
        }
      }
    }
  ]
}
```

## Payload Request Yang Sudah Dipetakan Frontend

Frontend akan mengirim payload berikut saat mode `http` aktif:

### Simpan karyawan

```json
{
  "nomor_induk": "EMP-001",
  "nama_lengkap": "Rina Paramita",
  "email": "rina.paramita@ssms.test",
  "departemen": "Finance",
  "jabatan": "Senior Finance Officer",
  "tanggal_bergabung": "2023-02-14",
  "status_aktif": true
}
```

### Simpan departemen

```json
{
  "nama_departemen": "Finance"
}
```

### Simpan jabatan

```json
{
  "nama_jabatan": "HR Generalist"
}
```

### Ajukan cuti

```json
{
  "tanggal_mulai": "2026-04-20",
  "tanggal_selesai": "2026-04-21",
  "alasan": "Acara keluarga"
}
```

## Catatan Integrasi Backend

- Endpoint `PUT` saat ini diasumsikan tersedia untuk update resource.
- Endpoint `DELETE` diasumsikan tersedia untuk hapus resource.
- Endpoint list absensi dan cuti saat ini diasumsikan menerima query `scope=admin` atau `scope=me`.
- Jika backend Laravel memilih shape yang sedikit berbeda, cukup sesuaikan di `src/services/api/normalizers.js` dan `src/services/httpHrApi.js`.

## Langkah Selanjutnya Yang Disarankan

- Tambahkan token auth dari endpoint login ke `apiRequest`.
- Ganti preview role dengan role hasil login backend.
- Sambungkan dashboard ke endpoint summary khusus agar tidak perlu fan-out request banyak resource.
- Tambahkan loading state dan error state per halaman untuk mode `http`.
- Implementasikan route dan resource Laravel mengikuti blueprint di folder `docs`.
