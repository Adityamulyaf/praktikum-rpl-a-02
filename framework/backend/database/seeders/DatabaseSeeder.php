<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\SppgProfile;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(SchoolSeeder::class);

        $testUsers = [
            ['email' => 'admin@halombg.com',  'name' => 'Test Admin',  'role' => 'admin'],
            ['email' => 'sppg@halombg.com',   'name' => 'Test SPPG',   'role' => 'sppg'],
            ['email' => 'guru@halombg.com',   'name' => 'Test Guru',   'role' => 'guru'],
            ['email' => 'siswa@halombg.com',  'name' => 'Test Siswa',  'role' => 'siswa'],
        ];

        foreach ($testUsers as $data) {
            User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name'      => $data['name'],
                    'password'  => 'password',
                    'role'      => $data['role'],
                    'is_active' => true,
                ]
            );
        }

        // Create additional SPPG users for seeding 1000 profiles
        $sppgCount = User::where('role', 'sppg')->count();
        if ($sppgCount < 10) {
            for ($i = 2; $i <= 10; $i++) {
                User::updateOrCreate(
                    ['email' => 'sppg' . $i . '@halombg.com'],
                    [
                        'name'      => 'Test SPPG ' . $i,
                        'password'  => 'password',
                        'role'      => 'sppg',
                        'is_active' => true,
                    ]
                );
            }
        }

        if (User::count() < 5) {
            User::factory(10)->create();
        }

        $this->call(SppgProfile::class);
    }
}