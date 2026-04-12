# Deploy Backend ke InfinityFree

Panduan ini dipakai jika Anda ingin menjalankan backend Laravel tanpa kartu kredit.

## Struktur upload

Gunakan struktur seperti ini di hosting InfinityFree:

```text
account-root/
|- htdocs/ atau public_html/
|  |- index.php
|  |- .htaccess
|- sistem-hr-backend/
   |- app/
   |- bootstrap/
   |- config/
   |- database/
   |- public/
   |- routes/
   |- storage/
   |- vendor/
   |- .env
```

File untuk web root sudah disiapkan di:

- `deploy/infinityfree/webroot/index.php`
- `deploy/infinityfree/webroot/.htaccess`

## File environment

Salin:

- `sistem-hr-backend/.env.infinityfree.example`

menjadi:

- `sistem-hr-backend/.env`

Lalu isi nilai database InfinityFree Anda.

Gunakan mode ini:

- `DB_CONNECTION=mysql`
- `SESSION_DRIVER=file`
- `CACHE_STORE=file`
- `QUEUE_CONNECTION=sync`

## Inisialisasi database

Import file berikut melalui phpMyAdmin InfinityFree:

- `sistem-hr-backend/database/infinityfree-init.sql`

File ini sudah berisi:

- tabel inti aplikasi
- akun demo
- departemen dan jabatan awal

## Akun demo

- Admin HR: `admin@ssms.test` / `password`
- Karyawan: `rina.paramita@ssms.test` / `password`

## Menyambungkan frontend Vercel

Setelah backend InfinityFree aktif, ubah env frontend di Vercel:

- `VITE_DATA_SOURCE=http`
- `VITE_API_BASE_URL=https://<domain-backend-anda>`

Lalu redeploy frontend.
