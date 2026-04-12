<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AttendanceFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\DemoHrSeeder::class);
    }

    public function test_employee_can_clock_in_and_clock_out_on_same_day(): void
    {
        $employee = User::query()->where('email', 'rina.paramita@ssms.test')->firstOrFail();

        Sanctum::actingAs($employee);

        $this->postJson('/api/absensi/clock-in')
            ->assertOk()
            ->assertJsonPath('data.status', 'Hadir');

        $this->postJson('/api/absensi/clock-out')
            ->assertOk()
            ->assertJsonPath('data.status', 'Hadir');

        $this->getJson('/api/absensi/riwayat?scope=me')
            ->assertOk()
            ->assertJsonPath('data.0.karyawan.nama_lengkap', 'Rina Paramita');
    }

    public function test_employee_cannot_clock_in_twice_on_same_day(): void
    {
        $employee = User::query()->where('email', 'rina.paramita@ssms.test')->firstOrFail();

        Sanctum::actingAs($employee);

        $this->postJson('/api/absensi/clock-in')->assertOk();

        $this->postJson('/api/absensi/clock-in')
            ->assertStatus(422)
            ->assertJsonPath('message', 'Clock-in hari ini sudah tercatat.');
    }

    public function test_employee_cannot_clock_out_twice_on_same_day(): void
    {
        $employee = User::query()->where('email', 'rina.paramita@ssms.test')->firstOrFail();

        Sanctum::actingAs($employee);

        $this->postJson('/api/absensi/clock-in')->assertOk();
        $this->postJson('/api/absensi/clock-out')->assertOk();

        $this->postJson('/api/absensi/clock-out')
            ->assertStatus(422)
            ->assertJsonPath('message', 'Clock-out hari ini sudah tercatat.');
    }
}
