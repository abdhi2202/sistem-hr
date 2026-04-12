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
