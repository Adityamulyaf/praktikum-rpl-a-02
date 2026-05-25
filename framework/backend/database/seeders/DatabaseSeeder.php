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
        $this->call(SchoolSeeder::class);

        User::updateOrCreate(
            ['email' => 'admin@halombg.com'],
            [
                'name'      => 'Admin User',
                'password'  => 'password',
                'role'      => 'admin',
                'is_active' => true,
            ]
        );

        if (User::count() < 5) {
            User::factory(10)->create();
        }
    }
}