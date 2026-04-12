<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AjukanCutiRequest;
use App\Http\Requests\Api\ApproveCutiRequest;
use App\Http\Resources\Api\CutiResource;
use App\Models\Cuti;
use Illuminate\Http\JsonResponse;

class CutiController extends Controller
{
    public function index(): JsonResponse
    {
        $scope = request('scope', 'me');
        $user = request()->user();

        $query = Cuti::query()->with('karyawan.departemen');

        if ($scope !== 'admin' || $user?->role !== 'admin_hr') {
            $query->where('karyawan_id', $user?->karyawan?->id);
        }

        return response()->json([
            'data' => CutiResource::collection($query->latest('tanggal_mulai')->get()),
        ]);
    }

    public function store(AjukanCutiRequest $request): JsonResponse
    {
        $karyawan = $request->user()->karyawan;

        abort_if(! $karyawan, 404, 'Data karyawan tidak ditemukan.');

        $cuti = Cuti::query()->create([
            'karyawan_id' => $karyawan->id,
            'tanggal_mulai' => $request->validated('tanggal_mulai'),
            'tanggal_selesai' => $request->validated('tanggal_selesai'),
            'alasan' => $request->validated('alasan'),
            'status_pengajuan' => 'Pending',
        ]);

        $cuti->load('karyawan.departemen');

        return response()->json([
            'data' => new CutiResource($cuti),
            'message' => 'Pengajuan cuti berhasil dibuat.',
        ], 201);
    }

    public function approve(ApproveCutiRequest $request, Cuti $cuti): JsonResponse
    {
        $cuti->update([
            'status_pengajuan' => $request->validated('status_pengajuan'),
            'disetujui_oleh' => $request->user()->id,
        ]);

        $cuti->load('karyawan.departemen');

        return response()->json([
            'data' => new CutiResource($cuti),
            'message' => 'Status cuti berhasil diperbarui.',
        ]);
    }
}
