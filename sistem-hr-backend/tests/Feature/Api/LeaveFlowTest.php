<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LeaveFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\DemoHrSeeder::class);
    }

    public function test_employee_can_submit_leave_request(): void
    {
        $employee = User::query()->where('email', 'rina.paramita@ssms.test')->firstOrFail();

        Sanctum::actingAs($employee);

        $this->postJson('/api/cuti/ajukan', [
            'tanggal_mulai' => '2026-04-20',
            'tanggal_selesai' => '2026-04-21',
            'alasan' => 'Acara keluarga',
        ])
            ->assertCreated()
            ->assertJsonPath('data.status_pengajuan', 'Pending')
            ->assertJsonPath('data.karyawan.nama_lengkap', 'Rina Paramita');
    }

    public function test_admin_can_approve_leave_request(): void
    {
        $employee = User::query()->where('email', 'rina.paramita@ssms.test')->firstOrFail();
        $admin = User::query()->where('email', 'admin@ssms.test')->firstOrFail();

        Sanctum::actingAs($employee);

        $leaveResponse = $this->postJson('/api/cuti/ajukan', [
            'tanggal_mulai' => '2026-04-20',
            'tanggal_selesai' => '2026-04-21',
            'alasan' => 'Acara keluarga',
        ])->assertCreated();

        Sanctum::actingAs($admin);

        $this->postJson('/api/cuti/approve/' . $leaveResponse->json('data.id'), [
            'status_pengajuan' => 'Disetujui',
        ])
            ->assertOk()
            ->assertJsonPath('data.status_pengajuan', 'Disetujui');
    }
}
