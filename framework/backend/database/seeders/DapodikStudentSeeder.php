<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\DapodikStudent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DapodikStudentSeeder extends Seeder
{
    public function run(): void
    {
        // Truncate first
        DB::table('dapodik_students')->truncate();

        // Get 5 schools from Kebumen (to match SPPG Kebumen Buayan Rangkah)
        $schools = School::where('district', 'like', '%Kebumen%')->orderBy('id')->take(5)->get();

        if ($schools->isEmpty()) {
            $this->command->error('Tidak ada sekolah terdaftar di database untuk men-seed dapodik_students.');
            return;
        }

        $names = [
            'Ahmad Pratama', 'Budi Santoso', 'Siti Rahmawati', 'Dewi Lestari', 'Eko Wibowo',
            'Fitri Hidayat', 'Guntur Kusuma', 'Hadi Wijaya', 'Indah Purnama', 'Joko Setiawan',
            'Kartika Nugroho', 'Lani Putra', 'Mulyono Putri', 'Novi Gunawan', 'Oki Saputra',
            'Putri Utama', 'Rian Ramadhan', 'Sari Fitriani', 'Taufik Subagyo', 'Utami Astuti',
            'Vina Hadi', 'Wawan Firmansyah', 'Yanti Siregar', 'Zainal Lubis', 'Aditya Nasution',
            'Bambang Ginting', 'Cahya Sitorus', 'Diana Manurung', 'Farhan Tampubolon', 'Gita Wijaya'
        ];

        $now = now();
        $records = [];

        foreach ($schools as $index => $school) {
            $schoolNum = $index + 1; // 1, 2, 3, 4, 5
            
            for ($j = 1; $j <= 30; $j++) {
                // Generate unique NISN: '0080000' + school index (1-digit) + student index (2-digit, 01-30)
                $nisn = '0080000' . $schoolNum . str_pad($j, 2, '0', STR_PAD_LEFT);
                $name = $names[$j - 1];

                $records[] = [
                    'nisn' => $nisn,
                    'name' => $name,
                    'school_id' => $school->id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        DapodikStudent::insert($records);
        $this->command->info('Berhasil men-seed ' . count($records) . ' siswa dummy ke dapodik_students.');

        // Link the first 5 schools to the test SPPG (sppg@halombg.com)
        $testSppgUser = \App\Models\User::where('email', 'sppg@halombg.com')->first();
        if ($testSppgUser) {
            $testSppgProfile = \App\Models\SppgProfile::where('user_id', $testSppgUser->ssid)->first();
            if ($testSppgProfile) {
                $sppgSchools = [];
                foreach ($schools as $school) {
                    $sppgSchools[] = [
                        'sppg_id'   => $testSppgProfile->id,
                        'school_id' => $school->id,
                    ];
                }
                \Illuminate\Support\Facades\DB::table('sppg_schools')->insertOrIgnore($sppgSchools);
                $this->command->info('Berhasil menghubungkan 5 sekolah dummy ke SPPG: ' . $testSppgProfile->kitchen_name);
            }
        }
    }
}
