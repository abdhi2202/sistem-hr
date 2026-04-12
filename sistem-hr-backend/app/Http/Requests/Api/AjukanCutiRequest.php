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
