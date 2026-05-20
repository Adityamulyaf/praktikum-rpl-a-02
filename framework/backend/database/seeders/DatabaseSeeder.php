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
        // Creates a specific admin user so your curl login command works!
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@halombg.com',
            'password' => bcrypt('password'), // Use a secure password in production!
            'role' => 'admin',
        ]);

        // Creates 10 other random users (teachers, students, etc.)
        User::factory(10)->create();
    }
}