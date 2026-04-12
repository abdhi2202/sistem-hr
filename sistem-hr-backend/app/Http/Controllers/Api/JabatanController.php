<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreLookupRequest;
use App\Http\Resources\Api\LookupResource;
use App\Models\Jabatan;
use Illuminate\Http\JsonResponse;

class JabatanController extends Controller
{
    public function index(): JsonResponse
    {
        $jabatans = Jabatan::query()
            ->withCount('karyawans')
            ->orderBy('nama_jabatan')
            ->get();

        return response()->json([
            'data' => LookupResource::collection($jabatans),
        ]);
    }

    public function store(StoreLookupRequest $request): JsonResponse
    {
        $jabatan = Jabatan::query()->create([
            'nama_jabatan' => $request->validated('nama_jabatan'),
        ]);

        $jabatan->loadCount('karyawans');

        return response()->json([
            'data' => new LookupResource($jabatan),
            'message' => 'Jabatan berhasil ditambahkan.',
        ], 201);
    }

    public function update(StoreLookupRequest $request, Jabatan $jabatan): JsonResponse
    {
        $jabatan->update([
            'nama_jabatan' => $request->validated('nama_jabatan'),
        ]);

        $jabatan->loadCount('karyawans');

        return response()->json([
            'data' => new LookupResource($jabatan),
            'message' => 'Jabatan berhasil diperbarui.',
        ]);
    }

    public function destroy(Jabatan $jabatan): JsonResponse
    {
        $jabatan->delete();

        return response()->json([
            'message' => 'Jabatan berhasil dihapus.',
        ]);
    }
}
