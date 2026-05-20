<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@halombg.com'],
            [
                'name'     => 'Admin User',
                'password' => bcrypt('password'),
                'role'     => 'admin',
            ]
        );

        if (User::count() < 5) {
            User::factory(10)->create();
        }
    }
}