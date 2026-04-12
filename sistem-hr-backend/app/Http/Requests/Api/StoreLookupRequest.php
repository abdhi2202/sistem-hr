<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreLookupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin_hr';
    }

    public function rules(): array
    {
        return [
            'nama_departemen' => ['nullable', 'string', 'max:255'],
            'nama_jabatan' => ['nullable', 'string', 'max:255'],
        ];
    }
}
