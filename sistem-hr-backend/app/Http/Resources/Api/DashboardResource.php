<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'admin' => [
                'stats' => $this['admin']['stats'],
                'absensi_terbaru' => AbsensiResource::collection($this['admin']['absensi_terbaru']),
                'cuti_pending' => CutiResource::collection($this['admin']['cuti_pending']),
            ],
            'karyawan' => [
                'summary' => $this['karyawan']['summary'],
                'riwayat_absensi' => AbsensiResource::collection($this['karyawan']['riwayat_absensi']),
                'riwayat_cuti' => CutiResource::collection($this['karyawan']['riwayat_cuti']),
            ],
        ];
    }
}
