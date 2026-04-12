<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LookupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_departemen' => $this->nama_departemen ?? null,
            'nama_jabatan' => $this->nama_jabatan ?? null,
            'karyawan_count' => $this->karyawans_count ?? $this->karyawan_count ?? 0,
        ];
    }
}
