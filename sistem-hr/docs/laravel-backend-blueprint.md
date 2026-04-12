# Blueprint Backend Laravel

Dokumen ini menjadi pasangan implementasi untuk frontend `sistem-hr` yang sudah berjalan dalam mode `mock` maupun `http`.

Tujuannya sederhana:
- menjaga shape response Laravel tetap cocok dengan normalizer frontend,
- mempercepat transisi dari mock data ke API sungguhan,
- memberi contoh struktur route, controller, request, dan resource yang bisa langsung diadaptasi.

## Stack Yang Diasumsikan

- Laravel 11
- Laravel Sanctum untuk token API
- MySQL atau PostgreSQL
- Resource class untuk serialisasi response
- Form Request untuk validasi
- Middleware role sederhana untuk `admin_hr` dan `karyawan`

## Urutan Implementasi Yang Disarankan

1. Buat migration dan relasi model: `users`, `departemens`, `jabatans`, `karyawans`, `absensis`, `cutis`.
2. Aktifkan Sanctum dan endpoint `POST /api/login`.
3. Implement middleware role agar route admin dan karyawan bisa dipisahkan.
4. Selesaikan resource master: `departemen`, `jabatan`, `karyawan`.
5. Sambungkan `absensi` dan `cuti`.
6. Tambahkan endpoint summary `GET /api/dashboard`.

## Route API Yang Direkomendasikan

Contoh `routes/api.php`:

```php
<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DepartemenController;
use App\Http\Controllers\Api\JabatanController;
use App\Http\Controllers\Api\KaryawanController;
use App\Http\Controllers\Api\AbsensiController;
use App\Http\Controllers\Api\CutiController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/absensi/riwayat', [AbsensiController::class, 'index']);
    Route::post('/absensi/clock-in', [AbsensiController::class, 'clockIn']);
    Route::post('/absensi/clock-out', [AbsensiController::class, 'clockOut']);

    Route::get('/cuti', [CutiController::class, 'index']);
    Route::post('/cuti/ajukan', [CutiController::class, 'store']);

    Route::middleware('role:admin_hr')->group(function () {
        Route::get('/departemen', [DepartemenController::class, 'index']);
        Route::post('/departemen', [DepartemenController::class, 'store']);
        Route::put('/departemen/{departemen}', [DepartemenController::class, 'update']);
        Route::delete('/departemen/{departemen}', [DepartemenController::class, 'destroy']);

        Route::get('/jabatan', [JabatanController::class, 'index']);
        Route::post('/jabatan', [JabatanController::class, 'store']);
        Route::put('/jabatan/{jabatan}', [JabatanController::class, 'update']);
        Route::delete('/jabatan/{jabatan}', [JabatanController::class, 'destroy']);

        Route::get('/karyawan', [KaryawanController::class, 'index']);
        Route::get('/karyawan/search', [KaryawanController::class, 'search']);
        Route::get('/karyawan/{karyawan}', [KaryawanController::class, 'show']);
        Route::post('/karyawan', [KaryawanController::class, 'store']);
        Route::put('/karyawan/{karyawan}', [KaryawanController::class, 'update']);
        Route::delete('/karyawan/{karyawan}', [KaryawanController::class, 'destroy']);

        Route::post('/cuti/approve/{cuti}', [CutiController::class, 'approve']);

        Route::get('/export/karyawan', [KaryawanController::class, 'exportCsv']);
        Route::get('/export/absensi', [AbsensiController::class, 'exportCsv']);
    });
});
```

## Middleware Role

Frontend membedakan akses `admin_hr` dan `karyawan`. Middleware paling sederhana:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, $roles, true)) {
            abort(403, 'Anda tidak memiliki akses ke resource ini.');
        }

        return $next($request);
    }
}
```

Jika memakai Laravel 11, alias middleware bisa didaftarkan di `bootstrap/app.php`.

## Kontrak Response Yang Harus Dijaga

Frontend saat ini paling aman jika backend mengembalikan:
- object tunggal dalam format `{ "data": { ... } }`, atau
- list dalam format `{ "data": [ ... ] }`.

Field `snake_case` aman karena sudah dipetakan oleh normalizer frontend.

### 1. Login

`POST /api/login`

Request:

```json
{
  "email": "admin@ssms.test",
  "password": "password"
}
```

Response yang direkomendasikan:

```json
{
  "data": {
    "token": "plain-text-token",
    "role": "admin_hr",
    "user": {
      "id": 1,
      "name": "Admin HR",
      "email": "admin@ssms.test"
    }
  }
}
```

Catatan:
- frontend juga menerima `access_token` sebagai pengganti `token`,
- `role` boleh berada di root data atau di dalam `user.role`.

### 2. Logout

`POST /api/logout`

Response minimal:

```json
{
  "message": "Logout berhasil"
}
```

### 3. Dashboard

Frontend punya endpoint map `/api/dashboard`, jadi backend bisa menghemat fan-out request dengan shape seperti ini:

```json
{
  "data": {
    "admin": {
      "stats": {
        "total_karyawan": 128,
        "karyawan_aktif": 121,
        "absensi_hari_ini": 103,
        "cuti_pending": 7
      },
      "absensi_terbaru": [
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
      ],
      "cuti_pending": [
        {
          "id": 10,
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
    },
    "karyawan": {
      "summary": {
        "status_hari_ini": "Sudah Clock-in",
        "jam_masuk": "08:01",
        "jam_keluar": "",
        "sisa_cuti": 9
      },
      "riwayat_absensi": [],
      "riwayat_cuti": []
    }
  }
}
```

Jika backend belum sempat membuat endpoint summary, frontend masih bisa bertahan memakai endpoint list terpisah.

### 4. Karyawan

`GET /api/karyawan`

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
        "id": 8,
        "email": "rina.paramita@ssms.test"
      },
      "departemen": {
        "id": 1,
        "nama_departemen": "Finance"
      },
      "jabatan": {
        "id": 2,
        "nama_jabatan": "Senior Finance Officer"
      }
    }
  ]
}
```

`POST /api/karyawan` dan `PUT /api/karyawan/{id}` menerima:

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

Jika backend ingin lebih relasional, frontend masih bisa diadaptasi. Namun agar transisi cepat, payload di atas paling aman untuk fase awal.

### 5. Departemen

`GET /api/departemen`

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

`POST/PUT` menerima:

```json
{
  "nama_departemen": "Finance"
}
```

### 6. Jabatan

`GET /api/jabatan`

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

`POST/PUT` menerima:

```json
{
  "nama_jabatan": "HR Generalist"
}
```

### 7. Absensi

`GET /api/absensi/riwayat?scope=admin`

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

`POST /api/absensi/clock-in`

```json
{
  "tanggal": "2026-04-12",
  "waktu_masuk": "08:00"
}
```

`POST /api/absensi/clock-out`

```json
{
  "tanggal": "2026-04-12",
  "waktu_keluar": "17:00"
}
```

Frontend tidak bergantung ketat pada payload request absensi, tetapi response akhirnya sebaiknya tetap kembali ke item absensi yang sudah dinormalisasi.

### 8. Cuti

`GET /api/cuti?scope=me`

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

`POST /api/cuti/ajukan`

```json
{
  "tanggal_mulai": "2026-04-20",
  "tanggal_selesai": "2026-04-21",
  "alasan": "Acara keluarga"
}
```

`POST /api/cuti/approve/{id}`

```json
{
  "status_pengajuan": "Disetujui"
}
```

Frontend saat ini memakai label `Pending`, `Disetujui`, `Ditolak`. Kalau backend memakai huruf kecil seperti `pending`, `disetujui`, `ditolak`, aman, tetapi sebaiknya diseragamkan di resource.

## Contoh Form Request

### StoreKaryawanRequest

```php
<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreKaryawanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin_hr';
    }

    public function rules(): array
    {
        return [
            'nomor_induk' => ['required', 'string', 'max:50', 'unique:karyawans,nomor_induk'],
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'departemen' => ['required', 'string', 'max:255'],
            'jabatan' => ['required', 'string', 'max:255'],
            'tanggal_bergabung' => ['required', 'date'],
            'status_aktif' => ['required', 'boolean'],
        ];
    }
}
```

### UpdateKaryawanRequest

```php
<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateKaryawanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin_hr';
    }

    public function rules(): array
    {
        $karyawan = $this->route('karyawan');

        return [
            'nomor_induk' => ['required', 'string', 'max:50', Rule::unique('karyawans', 'nomor_induk')->ignore($karyawan)],
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'departemen' => ['required', 'string', 'max:255'],
            'jabatan' => ['required', 'string', 'max:255'],
            'tanggal_bergabung' => ['required', 'date'],
            'status_aktif' => ['required', 'boolean'],
        ];
    }
}
```

### AjukanCutiRequest

```php
<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class AjukanCutiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'karyawan';
    }

    public function rules(): array
    {
        return [
            'tanggal_mulai' => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'alasan' => ['required', 'string', 'max:1000'],
        ];
    }
}
```

## Contoh Resource

### KaryawanResource

```php
<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KaryawanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nomor_induk' => $this->nomor_induk,
            'nama_lengkap' => $this->nama_lengkap,
            'tanggal_bergabung' => optional($this->tanggal_bergabung)->format('Y-m-d'),
            'status_aktif' => (bool) $this->status_aktif,
            'user' => [
                'id' => $this->user?->id,
                'email' => $this->user?->email,
            ],
            'departemen' => [
                'id' => $this->departemen?->id,
                'nama_departemen' => $this->departemen?->nama_departemen,
            ],
            'jabatan' => [
                'id' => $this->jabatan?->id,
                'nama_jabatan' => $this->jabatan?->nama_jabatan,
            ],
        ];
    }
}
```

### AbsensiResource

```php
<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AbsensiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tanggal' => optional($this->tanggal)->format('Y-m-d'),
            'waktu_masuk' => $this->waktu_masuk,
            'waktu_keluar' => $this->waktu_keluar,
            'status' => $this->status,
            'karyawan' => [
                'nama_lengkap' => $this->karyawan?->nama_lengkap,
                'departemen' => [
                    'nama_departemen' => $this->karyawan?->departemen?->nama_departemen,
                ],
            ],
        ];
    }
}
```

## Contoh Controller Ringkas

### AuthController@login

```php
public function login(LoginRequest $request): JsonResponse
{
    if (! Auth::attempt($request->validated())) {
        return response()->json([
            'message' => 'Email atau password tidak valid.',
        ], 422);
    }

    $user = User::query()->findOrFail(Auth::id());
    $token = $user->createToken('sistem-hr-web')->plainTextToken;

    return response()->json([
        'data' => [
            'token' => $token,
            'role' => $user->role,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ],
    ]);
}
```

### CutiController@approve

```php
public function approve(ApproveCutiRequest $request, Cuti $cuti): JsonResponse
{
    $cuti->update([
        'status_pengajuan' => $request->validated('status_pengajuan'),
        'disetujui_oleh' => $request->user()->id,
    ]);

    $cuti->load('karyawan.departemen');

    return response()->json([
        'data' => new CutiResource($cuti),
        'message' => 'Status cuti berhasil diperbarui.',
    ]);
}
```

## Query Yang Direkomendasikan

Beberapa query yang sebaiknya didukung backend agar UI sekarang langsung terlayani:

- `GET /api/karyawan/search?q=rina&dept=Finance`
- `GET /api/absensi/riwayat?scope=admin`
- `GET /api/absensi/riwayat?scope=me`
- `GET /api/cuti?scope=admin`
- `GET /api/cuti?scope=me`

Kalau nama query backend berbeda, cukup sesuaikan `src/services/httpHrApi.js`.

## Error Response Yang Disarankan

Frontend sudah punya UX untuk `401`, `403`, dan error global. Shape error paling aman:

```json
{
  "message": "Anda tidak memiliki akses ke resource ini."
}
```

Untuk validation error Laravel standar juga aman:

```json
{
  "message": "Data yang diberikan tidak valid.",
  "errors": {
    "email": [
      "Email wajib diisi."
    ]
  }
}
```

## Checklist Siap Integrasi

- `POST /api/login` mengembalikan token dan role.
- `POST /api/logout` menghapus token aktif.
- Semua route selain login memakai `auth:sanctum`.
- Route admin dilindungi middleware role `admin_hr`.
- Resource memakai field `snake_case` yang stabil.
- Response list dibungkus `data`.
- Response item dibungkus `data`.
- Error `401` dan `403` mengembalikan status HTTP yang tepat.
- CORS mengizinkan origin frontend Vite saat development.

Jika seluruh checklist ini terpenuhi, frontend yang sekarang seharusnya bisa beralih dari `mock` ke `http` dengan perubahan yang sangat kecil.
