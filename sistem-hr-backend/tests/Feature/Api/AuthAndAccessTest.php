<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthAndAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\DemoHrSeeder::class);
    }

    public function test_login_returns_token_and_role_for_admin(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'admin@ssms.test',
            'password' => 'password',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.role', 'admin_hr')
            ->assertJsonPath('data.user.email', 'admin@ssms.test');

        $this->assertNotEmpty($response->json('data.token'));
    }

    public function test_dashboard_requires_authentication(): void
    {
        $this->getJson('/api/dashboard')->assertUnauthorized();
    }

    public function test_admin_can_access_employee_list(): void
    {
        $admin = User::query()->where('email', 'admin@ssms.test')->firstOrFail();

        Sanctum::actingAs($admin);

        $this->getJson('/api/karyawan')
            ->assertOk()
            ->assertJsonFragment([
                'nomor_induk' => 'EMP-001',
                'nama_lengkap' => 'Rina Paramita',
            ]);
    }

    public function test_employee_cannot_access_admin_employee_list(): void
    {
        $employee = User::query()->where('email', 'rina.paramita@ssms.test')->firstOrFail();

        Sanctum::actingAs($employee);

        $this->getJson('/api/karyawan')->assertForbidden();
    }

    public function test_admin_can_create_employee_and_new_employee_can_login(): void
    {
        $admin = User::query()->where('email', 'admin@ssms.test')->firstOrFail();

        Sanctum::actingAs($admin);

        $this->postJson('/api/karyawan', [
            'nomor_induk' => 'EMP-777',
            'nama_lengkap' => 'Tara Pratama',
            'email' => 'tara.pratama@ssms.test',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
            'departemen' => 'People Ops',
            'jabatan' => 'Staff HR',
            'tanggal_bergabung' => '2026-04-12',
            'status_aktif' => true,
        ])->assertCreated();

        $this->assertDatabaseHas('users', [
            'email' => 'tara.pratama@ssms.test',
            'role' => 'karyawan',
        ]);

        $this->assertDatabaseHas('karyawans', [
            'nomor_induk' => 'EMP-777',
            'nama_lengkap' => 'Tara Pratama',
        ]);

        $this->app['auth']->forgetGuards();

        $this->postJson('/api/login', [
            'email' => 'tara.pratama@ssms.test',
            'password' => 'rahasia123',
        ])
            ->assertOk()
            ->assertJsonPath('data.role', 'karyawan')
            ->assertJsonPath('data.user.email', 'tara.pratama@ssms.test');
    }

    public function test_employee_can_change_password_and_login_with_new_password(): void
    {
        $employee = User::query()->where('email', 'rina.paramita@ssms.test')->firstOrFail();

        Sanctum::actingAs($employee);

        $this->postJson('/api/password', [
            'current_password' => 'password',
            'password' => 'passwordBaru123',
            'password_confirmation' => 'passwordBaru123',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Password berhasil diperbarui.');

        $this->app['auth']->forgetGuards();

        $this->postJson('/api/login', [
            'email' => 'rina.paramita@ssms.test',
            'password' => 'password',
        ])->assertStatus(422);

        $this->postJson('/api/login', [
            'email' => 'rina.paramita@ssms.test',
            'password' => 'passwordBaru123',
        ])
            ->assertOk()
            ->assertJsonPath('data.role', 'karyawan')
            ->assertJsonPath('data.user.email', 'rina.paramita@ssms.test');
    }
}
