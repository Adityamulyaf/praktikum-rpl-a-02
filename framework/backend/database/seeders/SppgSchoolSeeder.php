<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SppgSchoolSeeder extends Seeder
{
    /**
     * Distribusikan sekolah ke SPPG berdasarkan kesamaan Kab./Kota.
     * Setiap SPPG mendapat 6–8 sekolah secara acak dari daerah yang sama.
     *
     * Menggunakan raw SQL + window function agar efisien di memori.
     */
    public function run(): void
    {
        // Bersihkan link lama
        DB::table('sppg_schools')->truncate();

        $sppgCount   = DB::table('sppg_profiles')->count();
        $schoolCount = DB::table('schools')->count();

        if ($sppgCount === 0) {
            $this->command->error('Tidak ada SPPG profile. Jalankan SppgProfile seeder terlebih dahulu.');
            return;
        }
        if ($schoolCount === 0) {
            $this->command->error('Tidak ada sekolah. Jalankan SchoolSeeder terlebih dahulu.');
            return;
        }

        $this->command->info("Mencocokkan {$sppgCount} SPPG dengan {$schoolCount} sekolah berdasarkan Kab./Kota...");
        $this->command->info("Setiap SPPG akan mendapat 6–8 sekolah secara acak dari daerahnya.");

        // Normalisasi Kab./Kota: hapus prefix "Kab.", "Kota.", "Kabupaten", "Kota " lalu UPPER & TRIM
        $normSppg   = "UPPER(TRIM(REGEXP_REPLACE(TRIM(sp.district), '^(Kab\\.|Kota\\.|Kabupaten |Kota )\\s*', '', 'i')))";
        $normSchool = "UPPER(TRIM(REGEXP_REPLACE(TRIM(s.district),  '^(Kab\\.|Kota\\.|Kabupaten |Kota )\\s*', '', 'i')))";

        // CTE sppg_limits: buat limit acak 6–8 per SPPG (dievaluasi sekali per baris SPPG)
        // CTE ranked: JOIN sekolah di daerah yang sama, beri nomor urut acak per SPPG
        // Filter: ambil hanya sekolah dengan nomor urut ≤ limit acak masing-masing SPPG
        $sql = "
            WITH sppg_limits AS (
                SELECT id, (FLOOR(6 + RANDOM() * 3))::int AS lim
                FROM sppg_profiles
            ),
            ranked AS (
                SELECT
                    sp.id          AS sppg_id,
                    s.id           AS school_id,
                    sl.lim,
                    ROW_NUMBER() OVER (PARTITION BY sp.id ORDER BY RANDOM()) AS rn
                FROM sppg_profiles sp
                JOIN sppg_limits sl ON sl.id = sp.id
                JOIN schools s
                  ON {$normSppg} = {$normSchool}
                 AND sp.district IS NOT NULL AND TRIM(sp.district) <> ''
                 AND s.district  IS NOT NULL AND TRIM(s.district)  <> ''
            )
            INSERT INTO sppg_schools (sppg_id, school_id)
            SELECT sppg_id, school_id
            FROM ranked
            WHERE rn <= lim
            ON CONFLICT (sppg_id, school_id) DO NOTHING
        ";

        DB::statement($sql);

        $totalLinked   = DB::table('sppg_schools')->count();
        $matchedSppg   = DB::table('sppg_schools')->distinct()->count('sppg_id');
        $unmatchedSppg = $sppgCount - $matchedSppg;
        $avgPerSppg    = $matchedSppg > 0 ? round($totalLinked / $matchedSppg, 1) : 0;

        $this->command->info("Selesai: {$totalLinked} link sekolah-SPPG dibuat.");
        $this->command->info("  - {$matchedSppg} dari {$sppgCount} SPPG berhasil dicocokkan (rata-rata {$avgPerSppg} sekolah/SPPG).");
        if ($unmatchedSppg > 0) {
            $this->command->warn("  - {$unmatchedSppg} SPPG tidak ditemukan sekolah yang sesuai di daerahnya.");
        }
    }
}
