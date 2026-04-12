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
        $userId = $karyawan?->user_id;

        return [
            'nomor_induk' => ['required', 'string', 'max:50', Rule::unique('karyawans', 'nomor_induk')->ignore($karyawan)],
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'departemen' => ['required', 'string', 'max:255'],
            'jabatan' => ['required', 'string', 'max:255'],
            'tanggal_bergabung' => ['required', 'date'],
            'status_aktif' => ['required', 'boolean'],
        ];
    }
}
