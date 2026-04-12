<?php

namespace Database\Seeders;

use App\Models\Departemen;
use App\Models\Jabatan;
use App\Models\Karyawan;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoHrSeeder extends Seeder
{
    public function run(): void
    {
        $finance = Departemen::query()->firstOrCreate(['nama_departemen' => 'Finance']);
        $peopleOps = Departemen::query()->firstOrCreate(['nama_departemen' => 'People Ops']);

        $financeLead = Jabatan::query()->firstOrCreate(['nama_jabatan' => 'Senior Finance Officer']);
        $hrOfficer = Jabatan::query()->firstOrCreate(['nama_jabatan' => 'HR Officer']);

        User::query()->firstOrCreate(
            ['email' => 'admin@ssms.test'],
            [
                'name' => 'Admin HR',
                'password' => bcrypt('password'),
                'role' => 'admin_hr',
            ]
        );

        $employeeUser = User::query()->firstOrCreate(
            ['email' => 'rina.paramita@ssms.test'],
            [
                'name' => 'Rina Paramita',
                'password' => bcrypt('password'),
                'role' => 'karyawan',
            ]
        );

        Karyawan::query()->firstOrCreate(
            ['nomor_induk' => 'EMP-001'],
            [
                'user_id' => $employeeUser->id,
                'departemen_id' => $finance->id,
                'jabatan_id' => $financeLead->id,
                'nama_lengkap' => 'Rina Paramita',
                'tanggal_bergabung' => '2023-02-14',
                'status_aktif' => true,
            ]
        );

        $employeeUserTwo = User::query()->firstOrCreate(
            ['email' => 'nadia.putri@ssms.test'],
            [
                'name' => 'Nadia Putri',
                'password' => bcrypt('password'),
                'role' => 'karyawan',
            ]
        );

        Karyawan::query()->firstOrCreate(
            ['nomor_induk' => 'EMP-002'],
            [
                'user_id' => $employeeUserTwo->id,
                'departemen_id' => $peopleOps->id,
                'jabatan_id' => $hrOfficer->id,
                'nama_lengkap' => 'Nadia Putri',
                'tanggal_bergabung' => '2024-01-08',
                'status_aktif' => true,
            ]
        );
    }
}
