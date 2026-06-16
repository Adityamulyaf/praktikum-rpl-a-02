<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\DapodikTeacher;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DapodikTeacherSeeder extends Seeder
{
    public function run(): void
    {
        // Truncate first
        DB::table('dapodik_teachers')->truncate();

        // Get 5 schools from Kebumen (same as student seeder)
        $schools = School::where('district', 'like', '%Kebumen%')->orderBy('id')->take(5)->get();

        if ($schools->isEmpty()) {
            $this->command->error('Tidak ada sekolah terdaftar di database untuk men-seed dapodik_teachers.');
            return;
        }

        $names = [
            'Heri Setiawan', 'Siti Aminah', 'Rudi Hermawan', 'Sri Wahyuni', 'Edi Susanto',
            'Kartini Hidayah', 'Gatot Koco', 'Herman Wijaya', 'Ika Lestari', 'Joko Suprianto',
            'Kusuma Nugraha', 'Lilis Rosita', 'Muhammad Yusuf', 'Nining Suryani', 'Oemar Bakri',
            'Puji Astuti', 'Roni Gunawan', 'Siti Rahayu', 'Teguh Wibowo', 'Umi Kulsum',
            'Vicky Prasetyo', 'Wahyudi Utomo', 'Yuliana Saputri', 'Zulham Efendi', 'Agus Salim',
            'Budiono Siregar', 'Cici Paramida', 'Dani Pedrosa', 'Fitri Handayani', 'Gunawan Wibisono'
        ];

        // Make sure the existing dummy guru from database seeder (NIP: 198710102010121002) is registered
        // Let's attach them to the first school
        $firstSchool = $schools->first();
        DapodikTeacher::create([
            'nip' => '198710102010121002',
            'name' => 'Test Guru',
            'school_id' => $firstSchool->id,
        ]);

        $now = now();
        $records = [];

        foreach ($schools as $index => $school) {
            $schoolNum = $index + 1; // 1, 2, 3, 4, 5
            
            for ($j = 1; $j <= 30; $j++) {
                // Generate unique NIP: 19871010 + 201012 + 1 + schoolNum (1-digit) + student index (2-digit, 01-30)
                $nip = '198710102010121' . $schoolNum . str_pad($j, 2, '0', STR_PAD_LEFT);
                $name = $names[$j - 1];

                // Avoid collision with the manually created test guru NIP
                if ($nip === '198710102010121002' || $nip === '198710102010121102') {
                    $nip = '198710102010121' . $schoolNum . '99';
                }

                $records[] = [
                    'nip' => $nip,
                    'name' => $name,
                    'school_id' => $school->id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        DapodikTeacher::insert($records);
        $this->command->info('Berhasil men-seed ' . count($records) . ' guru dummy ke dapodik_teachers.');
    }
}
