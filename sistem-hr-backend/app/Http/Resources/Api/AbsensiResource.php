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
