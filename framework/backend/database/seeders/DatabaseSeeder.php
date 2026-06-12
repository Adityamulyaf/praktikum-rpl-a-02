<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\School;
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
                    'password'  => 'password', // Gunakan plain text karena cast 'password' => 'hashed' di model akan meng-hash secara otomatis
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

        // ── SEEDING DATA TAMBAHAN UNTUK TESTING EVALUASI AI (BL-13) ──

        // Ambil sekolah pertama yang terhubung dengan SPPG test ini (sekolah Kebumen) agar test siswa/guru sinkron
        $testSppgUser = User::where('email', 'sppg@halombg.com')->first();
        $testSppgProfile = $testSppgUser ? \App\Models\SppgProfile::where('user_id', $testSppgUser->ssid)->first() : null;
        $firstSchool = null;
        if ($testSppgProfile) {
            $firstSchool = $testSppgProfile->schools()->first();
        }
        if (!$firstSchool) {
            $firstSchool = School::orderBy('id')->first();
        }
        
        // 1. Lengkapi profile siswa@halombg.com
        $siswaUser = User::where('email', 'siswa@halombg.com')->first();
        if ($siswaUser && $firstSchool) {
            \App\Models\StudentProfile::updateOrCreate(
                ['user_id' => $siswaUser->ssid],
                [
                    'school_id' => $firstSchool->id,
                    'nisn'      => '0080000101',
                ]
            );
        }

        // 2. Lengkapi profile guru@halombg.com
        $guruUser = User::where('email', 'guru@halombg.com')->first();
        if ($guruUser && $firstSchool) {
            \App\Models\TeacherProfile::updateOrCreate(
                ['user_id' => $guruUser->ssid],
                [
                    'school_id' => $firstSchool->id,
                    'nip'       => '198710102010121002',
                ]
            );
        }

        // 3. Masukkan Menu dan Ulasan Siswa untuk Dapur sppg@halombg.com
        $testSppgUser = User::where('email', 'sppg@halombg.com')->first();
        if ($testSppgUser) {
            $testSppgProfile = \App\Models\SppgProfile::where('user_id', $testSppgUser->ssid)->first();
            if ($testSppgProfile && $firstSchool) {
                // Pastikan sekolah pertama terhubung dengan SPPG test ini
                \Illuminate\Support\Facades\DB::table('sppg_schools')->insertOrIgnore([
                    'sppg_id'   => $testSppgProfile->id,
                    'school_id' => $firstSchool->id,
                ]);

                 // Ambil gambar menu dari aset frontend dan ubah ke base64
                 $photoPath = database_path('seeders/data/mbg2.jpg');
                 $photoBase64 = null;
                 if (file_exists($photoPath)) {
                     $photoData = file_get_contents($photoPath);
                     $photoBase64 = 'data:image/jpeg;base64,' . base64_encode($photoData);
                 }
 
                 // Ambil gambar status distribusi dari aset frontend dan ubah ke base64
                 $distPath = database_path('seeders/data/distribusi-mbg.png');
                 $distBase64 = null;
                 if (file_exists($distPath)) {
                     $distData = file_get_contents($distPath);
                     $distBase64 = 'data:image/png;base64,' . base64_encode($distData);
                 }

                // Seed menu dan ulasan untuk 3 hari terakhir (Hari ini, Kemarin, dan 2 Hari Lalu)
                $dates = [
                    now('Asia/Jakarta')->toDateString(),
                    now('Asia/Jakarta')->subDay()->toDateString(),
                    now('Asia/Jakarta')->subDays(2)->toDateString(),
                ];

                $reviewTemplates = [
                    [
                        'name' => 'Budi Santoso',
                        'email' => 'budi@example.com',
                        'nisn' => '0080000102',
                        'content' => 'Nasi kuningnya wangi sekali dan ayamnya sangat renyah. Enak banget!',
                    ],
                    [
                        'name' => 'Siti Rahmawati',
                        'email' => 'siti@example.com',
                        'nisn' => '0080000103',
                        'content' => 'Makanannya lezat. Porsinya pas buat makan siang.',
                    ],
                    [
                        'name' => 'Dewi Lestari',
                        'email' => 'dewi@example.com',
                        'nisn' => '0080000104',
                        'content' => 'Rasa makanan biasa saja, telur agak sedikit asin.',
                    ],
                    [
                        'name' => 'Eko Wibowo',
                        'email' => 'eko@example.com',
                        'nisn' => '0080000105',
                        'content' => 'Ayamnya agak keras dan sayur seladanya sedikit kurang segar.',
                    ],
                    [
                        'name' => 'Fitri Hidayat',
                        'email' => 'fitri@example.com',
                        'nisn' => '0080000106',
                        'content' => 'Susu kotaknya segar, nasi kuningnya enak. Terima kasih program MBG!',
                    ],
                ];

                foreach ($dates as $menuDate) {
                    // Buat Menu Harian
                    \App\Models\DailyMenu::updateOrCreate(
                        [
                            'sppg_id'   => $testSppgProfile->id,
                            'served_at' => $menuDate,
                        ],
                        [
                            'menu_name'       => 'Nasi Kuning, Ayam Krispi, Telur Suwir, Selada dan Timun, Pisang, Susu Kotak',
                            'components'      => 'Nasi kuning gurih, ayam goreng renyah (krispi), telur dadar iris (suwir), lalapan selada segar dan potongan timun, buah pisang, dan susu kotak UHT.',
                            'calories'        => 650,
                            'protein'         => 24,
                            'carbs'           => 85,
                            'fat'             => 15,
                            'photo'           => $photoBase64,
                            'is_ai_validated' => true,
                        ]
                    );

                    // Buat Status Distribusi untuk semua sekolah SPPG ini
                    $schoolIds = \Illuminate\Support\Facades\DB::table('sppg_schools')
                        ->where('sppg_id', $testSppgProfile->id)
                        ->pluck('school_id');

                    foreach ($schoolIds as $schoolId) {
                        \App\Models\DistributionStatus::updateOrCreate(
                            [
                                'sppg_id'        => $testSppgProfile->id,
                                'school_id'      => $schoolId,
                                'distributed_at' => $menuDate,
                            ],
                            [
                                'status'            => 'sudah_diantar',
                                'status_updated_at' => now(),
                                'photo'             => $distBase64,
                            ]
                        );
                    }

                    // Buat Ulasan Siswa
                    foreach ($reviewTemplates as $rTemp) {
                        $studentUser = User::updateOrCreate(
                            ['email' => $rTemp['email']],
                            [
                                'name'      => $rTemp['name'],
                                'password'  => 'password',
                                'role'      => 'siswa',
                                'is_active' => true,
                            ]
                        );

                        \App\Models\StudentProfile::updateOrCreate(
                            ['user_id' => $studentUser->ssid],
                            [
                                'school_id' => $firstSchool->id,
                                'nisn'      => $rTemp['nisn'],
                            ]
                        );

                        \App\Models\Review::updateOrCreate(
                            [
                                'user_id'     => $studentUser->ssid,
                                'review_date' => $menuDate,
                            ],
                            [
                                'school_id'   => $firstSchool->id,
                                'sppg_id'     => $testSppgProfile->id,
                                'content'     => $rTemp['content'],
                                'flag_status' => 'none',
                            ]
                        );
                    }

                    // 4. Jalankan analisis sentimen harian (BL-13) programmatically
                    \Illuminate\Support\Facades\Artisan::call('sppg:generate-sentiment', [
                        '--date' => $menuDate
                    ]);
                }
            }
        }
    }
}