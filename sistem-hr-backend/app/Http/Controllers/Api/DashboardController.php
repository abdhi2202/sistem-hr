<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\DashboardResource;
use App\Models\Absensi;
use App\Models\Cuti;
use App\Models\Karyawan;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $user = request()->user();
        $today = now()->toDateString();
        $employee = $user?->karyawan;

        $payload = [
            'admin' => [
                'stats' => [
                    'total_karyawan' => Karyawan::query()->count(),
                    'karyawan_aktif' => Karyawan::query()->where('status_aktif', true)->count(),
                    'absensi_hari_ini' => Absensi::query()->whereDate('tanggal', $today)->count(),
                    'cuti_pending' => Cuti::query()->where('status_pengajuan', 'Pending')->count(),
                ],
                'absensi_terbaru' => Absensi::query()
                    ->with('karyawan.departemen')
                    ->latest('tanggal')
                    ->limit(5)
                    ->get(),
                'cuti_pending' => Cuti::query()
                    ->with('karyawan.departemen')
                    ->where('status_pengajuan', 'Pending')
                    ->latest('tanggal_mulai')
                    ->limit(5)
                    ->get(),
            ],
            'karyawan' => [
                'summary' => [
                    'status_hari_ini' => 'Belum Clock-in',
                    'jam_masuk' => '',
                    'jam_keluar' => '',
                    'sisa_cuti' => 0,
                ],
                'riwayat_absensi' => collect(),
                'riwayat_cuti' => collect(),
            ],
        ];

        if ($employee) {
            $todayAttendance = Absensi::query()
                ->where('karyawan_id', $employee->id)
                ->whereDate('tanggal', $today)
                ->first();

            $payload['karyawan']['summary'] = [
                'status_hari_ini' => $todayAttendance?->waktu_masuk ? 'Sudah Clock-in' : 'Belum Clock-in',
                'jam_masuk' => $todayAttendance?->waktu_masuk ?? '',
                'jam_keluar' => $todayAttendance?->waktu_keluar ?? '',
                'sisa_cuti' => 9,
            ];
            $payload['karyawan']['riwayat_absensi'] = Absensi::query()
                ->with('karyawan.departemen')
                ->where('karyawan_id', $employee->id)
                ->latest('tanggal')
                ->limit(5)
                ->get();
            $payload['karyawan']['riwayat_cuti'] = Cuti::query()
                ->with('karyawan.departemen')
                ->where('karyawan_id', $employee->id)
                ->latest('tanggal_mulai')
                ->limit(5)
                ->get();
        }

        return response()->json([
            'data' => new DashboardResource($payload),
        ]);
    }
}
