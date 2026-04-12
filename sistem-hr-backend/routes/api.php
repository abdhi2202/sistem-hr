<?php

use App\Http\Controllers\Api\AbsensiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CutiController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DepartemenController;
use App\Http\Controllers\Api\JabatanController;
use App\Http\Controllers\Api\KaryawanController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/password', [AuthController::class, 'changePassword']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/absensi/riwayat', [AbsensiController::class, 'index']);
    Route::post('/absensi/clock-in', [AbsensiController::class, 'clockIn']);
    Route::post('/absensi/clock-out', [AbsensiController::class, 'clockOut']);

    Route::get('/cuti', [CutiController::class, 'index']);
    Route::post('/cuti/ajukan', [CutiController::class, 'store']);

    Route::middleware('role:admin_hr')->group(function () {
        Route::get('/departemen', [DepartemenController::class, 'index']);
        Route::post('/departemen', [DepartemenController::class, 'store']);
        Route::put('/departemen/{departemen}', [DepartemenController::class, 'update']);
        Route::delete('/departemen/{departemen}', [DepartemenController::class, 'destroy']);

        Route::get('/jabatan', [JabatanController::class, 'index']);
        Route::post('/jabatan', [JabatanController::class, 'store']);
        Route::put('/jabatan/{jabatan}', [JabatanController::class, 'update']);
        Route::delete('/jabatan/{jabatan}', [JabatanController::class, 'destroy']);

        Route::get('/karyawan', [KaryawanController::class, 'index']);
        Route::get('/karyawan/search', [KaryawanController::class, 'search']);
        Route::get('/karyawan/{karyawan}', [KaryawanController::class, 'show']);
        Route::post('/karyawan', [KaryawanController::class, 'store']);
        Route::put('/karyawan/{karyawan}', [KaryawanController::class, 'update']);
        Route::delete('/karyawan/{karyawan}', [KaryawanController::class, 'destroy']);
        Route::get('/export/karyawan', [KaryawanController::class, 'exportCsv']);
        Route::get('/export/absensi', [AbsensiController::class, 'exportCsv']);

        Route::post('/cuti/approve/{cuti}', [CutiController::class, 'approve']);
    });
});
