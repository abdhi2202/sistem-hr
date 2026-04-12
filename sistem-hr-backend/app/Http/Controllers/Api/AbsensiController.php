<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\AbsensiResource;
use App\Models\Absensi;
use App\Models\Karyawan;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AbsensiController extends Controller
{
    public function index(): JsonResponse
    {
        $scope = request('scope', 'me');
        $user = request()->user();

        $query = Absensi::query()->with('karyawan.departemen');

        if ($scope !== 'admin' || $user?->role !== 'admin_hr') {
            $query->where('karyawan_id', $user?->karyawan?->id);
        }

        return response()->json([
            'data' => AbsensiResource::collection($query->latest('tanggal')->get()),
        ]);
    }

    public function clockIn(): JsonResponse
    {
        $karyawan = $this->resolveEmployee();
        $today = now()->toDateString();

        $absensi = Absensi::query()
            ->where('karyawan_id', $karyawan->id)
            ->whereDate('tanggal', $today)
            ->first();

        if ($absensi && $absensi->waktu_masuk) {
            return response()->json([
                'message' => 'Clock-in hari ini sudah tercatat.',
            ], 422);
        }

        if (! $absensi) {
            $absensi = Absensi::query()->create([
                'karyawan_id' => $karyawan->id,
                'tanggal' => $today,
                'waktu_masuk' => now()->format('H:i'),
                'status' => 'Hadir',
            ]);
        } else {
            $absensi->update(['waktu_masuk' => now()->format('H:i')]);
        }

        $absensi->load('karyawan.departemen');

        return response()->json([
            'data' => new AbsensiResource($absensi),
            'message' => 'Clock-in berhasil dicatat.',
        ]);
    }

    public function clockOut(): JsonResponse
    {
        $karyawan = $this->resolveEmployee();
        $today = now()->toDateString();

        $absensi = Absensi::query()
            ->where('karyawan_id', $karyawan->id)
            ->whereDate('tanggal', $today)
            ->first();

        if (! $absensi) {
            return response()->json([
                'message' => 'Lakukan clock-in terlebih dahulu sebelum clock-out.',
            ], 422);
        }

        if (! $absensi->waktu_masuk) {
            return response()->json([
                'message' => 'Lakukan clock-in terlebih dahulu sebelum clock-out.',
            ], 422);
        }

        if ($absensi->waktu_keluar) {
            return response()->json([
                'message' => 'Clock-out hari ini sudah tercatat.',
            ], 422);
        }

        $absensi->update([
            'waktu_keluar' => now()->format('H:i'),
        ]);

        $absensi->load('karyawan.departemen');

        return response()->json([
            'data' => new AbsensiResource($absensi),
            'message' => 'Clock-out berhasil dicatat.',
        ]);
    }

    public function exportCsv(): StreamedResponse
    {
        $rows = Absensi::query()
            ->with('karyawan.departemen')
            ->latest('tanggal')
            ->get();

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Tanggal', 'Nama', 'Departemen', 'Waktu Masuk', 'Waktu Keluar', 'Status']);

            foreach ($rows as $row) {
                fputcsv($handle, [
                    optional($row->tanggal)->format('Y-m-d'),
                    $row->karyawan?->nama_lengkap,
                    $row->karyawan?->departemen?->nama_departemen,
                    $row->waktu_masuk,
                    $row->waktu_keluar,
                    $row->status,
                ]);
            }

            fclose($handle);
        }, 'absensi.csv', ['Content-Type' => 'text/csv']);
    }

    protected function resolveEmployee(): Karyawan
    {
        /** @var Karyawan $employee */
        $employee = request()->user()->karyawan;

        abort_if(! $employee, 404, 'Data karyawan tidak ditemukan.');

        return $employee;
    }
}
