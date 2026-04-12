<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApproveCutiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin_hr';
    }

    public function rules(): array
    {
        return [
            'status_pengajuan' => ['required', 'string', Rule::in(['Pending', 'Disetujui', 'Ditolak'])],
        ];
    }
}
