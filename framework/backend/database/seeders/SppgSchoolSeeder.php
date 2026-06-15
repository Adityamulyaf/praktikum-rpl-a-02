<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SppgSchoolSeeder extends Seeder
{
    /**
     * Known district name mismatches between SPPG CSV and school CSV.
     * Maps both variants to a common canonical name for matching.
     */
    private const DISTRICT_ALIASES = [
        // Jakarta: SPPG uses "KOTA ADM. JAKARTA X", school uses "Kota Jakarta X"
        // After base normalization strips "KOTA ", SPPG becomes "ADM. JAKARTA X"
        'ADM. JAKARTA SELATAN'       => 'JAKARTA SELATAN',
        'ADM. JAKARTA BARAT'         => 'JAKARTA BARAT',
        'ADM. JAKARTA TIMUR'         => 'JAKARTA TIMUR',
        'ADM. JAKARTA UTARA'         => 'JAKARTA UTARA',
        'ADM. JAKARTA PUSAT'         => 'JAKARTA PUSAT',
        'KOTA ADM. JAKARTA SELATAN'  => 'JAKARTA SELATAN',
        'KOTA ADM. JAKARTA BARAT'    => 'JAKARTA BARAT',
        'KOTA ADM. JAKARTA TIMUR'    => 'JAKARTA TIMUR',
        'KOTA ADM. JAKARTA UTARA'    => 'JAKARTA UTARA',
        'KOTA ADM. JAKARTA PUSAT'    => 'JAKARTA PUSAT',
        'JAKARTA SELATAN'            => 'JAKARTA SELATAN',
        'JAKARTA BARAT'              => 'JAKARTA BARAT',
        'JAKARTA TIMUR'              => 'JAKARTA TIMUR',
        'JAKARTA UTARA'              => 'JAKARTA UTARA',
        'JAKARTA PUSAT'              => 'JAKARTA PUSAT',
        // Space vs no-space inconsistencies
        'GUNUNGKIDUL'                => 'GUNUNGKIDUL',
        'GUNUNG KIDUL'               => 'GUNUNGKIDUL',
        'JAYAWIJAYA'                 => 'JAYAWIJAYA',
        'JAYA WIJAYA'                => 'JAYAWIJAYA',
        'KUBU RAYA'                  => 'KUBURAYA',
        'KUBURAYA'                   => 'KUBURAYA',
        'TOLI TOLI'                  => 'TOLITOLI',
        'TOLITOLI'                   => 'TOLITOLI',
        'PANGKAL PINANG'             => 'PANGKALPINANG',
        'PANGKALPINANG'              => 'PANGKALPINANG',
        // Old vs new name
        'TOBA'                       => 'TOBA',
        'TOBA SAMOSIR'               => 'TOBA',
        // Typo in school CSV
        'NAGEKEO'                    => 'NAGEKEO',
        'NAGAKEO'                    => 'NAGEKEO',
    ];

    /**
     * Build the SQL expression that normalizes a city/district value
     * through the alias map, falling back to strip-prefix + uppercase.
     * $column is the fully-qualified column reference, e.g. "sp.city" or "s.district".
     */
    private function buildNormExpr(string $column): string
    {
        // Start with the base normalization: strip Kab./Kota prefix, upper, trim
        $base = "UPPER(TRIM(REGEXP_REPLACE(TRIM({$column}), '^(Kab\\.|Kota\\.|Kabupaten |Kota )\\s*', '', 'i')))";

        // Wrap in a CASE expression to handle known aliases
        $cases = [];
        foreach (self::DISTRICT_ALIASES as $from => $to) {
            $cases[] = "WHEN {$base} = '{$from}' THEN '{$to}'";
        }

        return "CASE " . implode(' ', $cases) . " ELSE {$base} END";
    }

    /**
     * Distribusikan sekolah ke SPPG berdasarkan kesamaan Kab./Kota.
     * Setiap SPPG mendapat 6–8 sekolah secara acak dari daerah yang sama.
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

        // Build normalized expressions with alias handling
        // SPPG uses `city` column for kab/kota; schools use `district`
        $normSppg   = $this->buildNormExpr('sp.city');
        $normSchool = $this->buildNormExpr('s.district');

        $this->command->info("Mencocokkan {$sppgCount} SPPG dengan {$schoolCount} sekolah berdasarkan Kab./Kota...");
        $this->command->info("Setiap SPPG akan mendapat 6–8 sekolah secara acak dari daerahnya.");

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
                 AND sp.city     IS NOT NULL AND TRIM(sp.city)     <> ''
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
