<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\SppgProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(SchoolSeeder::class);

        // 1. Calculate the hash ONCE right here
        $hashedPassword = Hash::make('password');

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
                    'password'  => $hashedPassword,
                    'role'      => $data['role'],
                    'is_active' => true,
                ]
            );
        }

        // Create 500 SPPG users to match CSV data using batch insert
        $sppgCount = User::where('role', 'sppg')->count();
        if ($sppgCount < 500) {
            $usersToCreate = [];
            for ($i = 2; $i <= 500; $i++) {
                $usersToCreate[] = [
                    'ssid'       => Str::uuid()->toString(),
                    'email'      => 'sppg' . $i . '@halombg.com',
                    'name'       => 'SPPG User ' . $i,
                    'password'   => $hashedPassword,
                    'role'       => 'sppg',
                    'is_active'  => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Insert in chunks to avoid query size limits
            foreach (array_chunk($usersToCreate, 100) as $chunk) {
                User::insertOrIgnore($chunk);
            }
        }

        if (User::count() < 5) {
            User::factory(10)->create();
        }

        // SppgProfile seeder harus setelah user dibuat
        $this->call(SppgProfile::class);

        // Distribusikan sekolah ke semua SPPG (10 sekolah per SPPG)
        $this->call(SppgSchoolSeeder::class);

        // DapodikStudentSeeder harus setelah user sppg@halombg.com ada
        // dan setelah SppgProfile agar bisa menemukan profil SPPG yang benar
        $this->call(DapodikStudentSeeder::class);
    }
}