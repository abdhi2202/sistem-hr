<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreLookupRequest;
use App\Http\Resources\Api\LookupResource;
use App\Models\Departemen;
use Illuminate\Http\JsonResponse;

class DepartemenController extends Controller
{
    public function index(): JsonResponse
    {
        $departemens = Departemen::query()
            ->withCount('karyawans')
            ->orderBy('nama_departemen')
            ->get();

        return response()->json([
            'data' => LookupResource::collection($departemens),
        ]);
    }

    public function store(StoreLookupRequest $request): JsonResponse
    {
        $departemen = Departemen::query()->create([
            'nama_departemen' => $request->validated('nama_departemen'),
        ]);

        $departemen->loadCount('karyawans');

        return response()->json([
            'data' => new LookupResource($departemen),
            'message' => 'Departemen berhasil ditambahkan.',
        ], 201);
    }

    public function update(StoreLookupRequest $request, Departemen $departemen): JsonResponse
    {
        $departemen->update([
            'nama_departemen' => $request->validated('nama_departemen'),
        ]);

        $departemen->loadCount('karyawans');

        return response()->json([
            'data' => new LookupResource($departemen),
            'message' => 'Departemen berhasil diperbarui.',
        ]);
    }

    public function destroy(Departemen $departemen): JsonResponse
    {
        $departemen->delete();

        return response()->json([
            'message' => 'Departemen berhasil dihapus.',
        ]);
    }
}
