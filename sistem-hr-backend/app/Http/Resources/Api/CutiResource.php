<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CutiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tanggal_mulai' => optional($this->tanggal_mulai)->format('Y-m-d'),
            'tanggal_selesai' => optional($this->tanggal_selesai)->format('Y-m-d'),
            'alasan' => $this->alasan,
            'status_pengajuan' => $this->status_pengajuan,
            'karyawan' => [
                'nama_lengkap' => $this->karyawan?->nama_lengkap,
                'departemen' => [
                    'nama_departemen' => $this->karyawan?->departemen?->nama_departemen,
                ],
            ],
        ];
    }
}
