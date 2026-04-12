<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreKaryawanRequest;
use App\Http\Requests\Api\UpdateKaryawanRequest;
use App\Http\Resources\Api\KaryawanResource;
use App\Models\Departemen;
use App\Models\Jabatan;
use App\Models\Karyawan;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class KaryawanController extends Controller
{
    public function index(): JsonResponse
    {
        $karyawans = Karyawan::query()
            ->with(['user', 'departemen', 'jabatan'])
            ->orderBy('nama_lengkap')
            ->get();

        return response()->json([
            'data' => KaryawanResource::collection($karyawans),
        ]);
    }

    public function show(Karyawan $karyawan): JsonResponse
    {
        $karyawan->load(['user', 'departemen', 'jabatan']);

        return response()->json([
            'data' => new KaryawanResource($karyawan),
        ]);
    }

    public function search(): JsonResponse
    {
        $query = Karyawan::query()->with(['user', 'departemen', 'jabatan']);

        if ($keyword = request('q')) {
            $query->where('nama_lengkap', 'like', '%' . $keyword . '%');
        }

        if ($dept = request('dept')) {
            $query->whereHas('departemen', function ($relation) use ($dept) {
                $relation->where('nama_departemen', $dept);
            });
        }

        return response()->json([
            'data' => KaryawanResource::collection($query->orderBy('nama_lengkap')->get()),
        ]);
    }

    public function store(StoreKaryawanRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $karyawan = DB::transaction(function () use ($validated) {
            $departemen = Departemen::query()->firstOrCreate([
                'nama_departemen' => $validated['departemen'],
            ]);

            $jabatan = Jabatan::query()->firstOrCreate([
                'nama_jabatan' => $validated['jabatan'],
            ]);

            $user = User::query()->create([
                'name' => $validated['nama_lengkap'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => 'karyawan',
            ]);

            return Karyawan::query()->create([
                'user_id' => $user->id,
                'departemen_id' => $departemen->id,
                'jabatan_id' => $jabatan->id,
                'nama_lengkap' => $validated['nama_lengkap'],
                'nomor_induk' => $validated['nomor_induk'],
                'tanggal_bergabung' => $validated['tanggal_bergabung'],
                'status_aktif' => $validated['status_aktif'],
            ]);
        });

        $karyawan->load(['user', 'departemen', 'jabatan']);

        return response()->json([
            'data' => new KaryawanResource($karyawan),
            'message' => 'Karyawan berhasil ditambahkan.',
        ], 201);
    }

    public function update(UpdateKaryawanRequest $request, Karyawan $karyawan): JsonResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $karyawan) {
            $departemen = Departemen::query()->firstOrCreate([
                'nama_departemen' => $validated['departemen'],
            ]);

            $jabatan = Jabatan::query()->firstOrCreate([
                'nama_jabatan' => $validated['jabatan'],
            ]);

            $userUpdates = [
                'name' => $validated['nama_lengkap'],
                'email' => $validated['email'],
            ];

            if (!empty($validated['password'])) {
                $userUpdates['password'] = $validated['password'];
            }

            $karyawan->user?->update($userUpdates);

            $karyawan->update([
                'departemen_id' => $departemen->id,
                'jabatan_id' => $jabatan->id,
                'nama_lengkap' => $validated['nama_lengkap'],
                'nomor_induk' => $validated['nomor_induk'],
                'tanggal_bergabung' => $validated['tanggal_bergabung'],
                'status_aktif' => $validated['status_aktif'],
            ]);
        });

        $karyawan->load(['user', 'departemen', 'jabatan']);

        return response()->json([
            'data' => new KaryawanResource($karyawan),
            'message' => 'Data karyawan berhasil diperbarui.',
        ]);
    }

    public function destroy(Karyawan $karyawan): JsonResponse
    {
        DB::transaction(function () use ($karyawan) {
            $user = $karyawan->user;
            $karyawan->delete();
            $user?->delete();
        });

        return response()->json([
            'message' => 'Karyawan berhasil dihapus.',
        ]);
    }

    public function exportCsv(): StreamedResponse
    {
        $rows = Karyawan::query()
            ->with(['departemen', 'jabatan'])
            ->orderBy('nama_lengkap')
            ->get();

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Nomor Induk', 'Nama Lengkap', 'Departemen', 'Jabatan', 'Tanggal Bergabung', 'Status Aktif']);

            foreach ($rows as $row) {
                fputcsv($handle, [
                    $row->nomor_induk,
                    $row->nama_lengkap,
                    $row->departemen?->nama_departemen,
                    $row->jabatan?->nama_jabatan,
                    optional($row->tanggal_bergabung)->format('Y-m-d'),
                    $row->status_aktif ? 'Aktif' : 'Nonaktif',
                ]);
            }

            fclose($handle);
        }, 'karyawan.csv', ['Content-Type' => 'text/csv']);
    }
}
