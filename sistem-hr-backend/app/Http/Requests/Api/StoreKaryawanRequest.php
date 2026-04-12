<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

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
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'departemen' => ['required', 'string', 'max:255'],
            'jabatan' => ['required', 'string', 'max:255'],
            'tanggal_bergabung' => ['required', 'date'],
            'status_aktif' => ['required', 'boolean'],
        ];
    }
}
