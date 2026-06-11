<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SchoolSeeder extends Seeder
{
    /**
     * Normalize school province name to match SPPG province format.
     * SPPG uses uppercase without "Prov." prefix, with some special name differences.
     */
    private function normalizeProvince(string $province, string $district = ''): string
    {
        $map = [
            'Prov. D.I. Yogyakarta'    => 'DAERAH ISTIMEWA YOGYAKARTA',
            'Prov. D.K.I. Jakarta'     => 'DKI JAKARTA',
            'Prov. Bangka Belitung'    => 'KEPULAUAN BANGKA BELITUNG',
            'Prov. Kepulauan Riau'     => 'KEPULAUAN RIAU',
            'Prov. Nusa Tenggara Barat' => 'NUSA TENGGARA BARAT',
            'Prov. Nusa Tenggara Timur' => 'NUSA TENGGARA TIMUR',
            'Prov. Kalimantan Barat'   => 'KALIMANTAN BARAT',
            'Prov. Kalimantan Selatan' => 'KALIMANTAN SELATAN',
            'Prov. Kalimantan Tengah'  => 'KALIMANTAN TENGAH',
            'Prov. Kalimantan Timur'   => 'KALIMANTAN TIMUR',
            'Prov. Kalimantan Utara'   => 'KALIMANTAN UTARA',
            'Prov. Sulawesi Barat'     => 'SULAWESI BARAT',
            'Prov. Sulawesi Selatan'   => 'SULAWESI SELATAN',
            'Prov. Sulawesi Tengah'    => 'SULAWESI TENGAH',
            'Prov. Sulawesi Tenggara'  => 'SULAWESI TENGGARA',
            'Prov. Sulawesi Utara'     => 'SULAWESI UTARA',
            'Prov. Sumatera Barat'     => 'SUMATERA BARAT',
            'Prov. Sumatera Selatan'   => 'SUMATERA SELATAN',
            'Prov. Sumatera Utara'     => 'SUMATERA UTARA',
            'Prov. Maluku Utara'       => 'MALUKU UTARA',
            'Prov. Jawa Barat'         => 'JAWA BARAT',
            'Prov. Jawa Tengah'        => 'JAWA TENGAH',
            'Prov. Jawa Timur'         => 'JAWA TIMUR',
            'Prov. Papua Barat'        => 'PAPUA BARAT',
        ];

        if (isset($map[$province])) {
            $mapped = $map[$province];

            // "Prov. Papua Barat" also needs kabupaten-level split for PAPUA BARAT DAYA
            if ($mapped === 'PAPUA BARAT' && $district !== '') {
                $norm = strtoupper(trim(preg_replace('/^(Kab\.|Kota|kab\.)\s*/', '', $district)));
                $baratDaya = [
                    'SORONG', 'SORONG SELATAN', 'MAYBRAT', 'TAMBRAUW',
                    'RAJA AMPAT',
                ];
                if (in_array($norm, $baratDaya)) {
                    return 'PAPUA BARAT DAYA';
                }
            }

            return $mapped;
        }

        // Default: strip "Prov. " prefix and uppercase
        $base = strtoupper(trim(preg_replace('/^Prov\.\s*/', '', $province)));

        // For old "Prov. Papua", split kabupaten/kota into the correct new province
        if ($base === 'PAPUA' && $district !== '') {
            return $this->resolvePapuaProvince($district);
        }

        return $base;
    }

    /**
     * Resolve the correct new province for kabupaten/kota in the old "Prov. Papua"
     * based on Indonesia's 2022 DOGR province split (UU No. 14-16/2022).
     */
    private function resolvePapuaProvince(string $district): string
    {
        // Normalize district name for matching
        $norm = strtoupper(trim(preg_replace('/^(Kab\.|Kota|kab\.)\s*/', '', $district)));

        // PAPUA PEGUNUNGAN (UU No. 16/2022) — highland regencies
        $pegunungan = [
            'JAYA WIJAYA', 'LANNY JAYA', 'NDUGA', 'PEGUNUNGAN BINTANG',
            'TOLIKARA', 'YAHUKIMO', 'YALIMO', 'PUNCAK JAYA', 'PUNCAK',
        ];

        // PAPUA TENGAH (UU No. 15/2022) — central regencies
        $tengah = [
            'MIMIKA', 'NABIRE', 'PANIAI', 'DOGIYAI', 'DEIYAI',
            'INTAN JAYA', 'WAROPEN', 'MAPPI',
        ];

        // PAPUA BARAT DAYA (UU No. 29/2022) — southwest regencies
        $baratDaya = [
            'SORONG', 'SORONG SELATAN', 'MAYBRAT', 'TAMBRAUW',
            'RAJA AMPAT',
        ];

        // PAPUA SELATAN (UU No. 14/2022) — southern regencies
        $selatan = [
            'MERAUKE', 'BOVEN DIGOEL', 'ASMAT',
        ];

        if (in_array($norm, $pegunungan)) return 'PAPUA PEGUNUNGAN';
        if (in_array($norm, $tengah))     return 'PAPUA TENGAH';
        if (in_array($norm, $baratDaya))  return 'PAPUA BARAT DAYA';
        if (in_array($norm, $selatan))    return 'PAPUA SELATAN';

        // Remaining kabupaten stay as PAPUA (Jayapura, Biak Numfor, Keerom, etc.)
        return 'PAPUA';
    }

    public function run(): void
    {
        $path = database_path('seeders/data/schools.csv');

        if (!file_exists($path)) {
            $this->command->error('File tidak ditemukan: ' . $path);
            return;
        }

        $handle = fopen($path, 'r');
        $header = fgetcsv($handle);

        $colIndex = array_flip($header);

        $chunk = [];
        $now   = now()->toDateTimeString();
        $count = 0;

        DB::table('schools')->truncate();

        while (($row = fgetcsv($handle)) !== false) {
            $rawDistrict = $row[$colIndex['kabupaten_kota']] ?? '';
            $rawProvince = $row[$colIndex['propinsi']] ?? '';
            $chunk[] = [
                'name'       => $row[$colIndex['sekolah']] ?? '',
                'address'    => $row[$colIndex['alamat_jalan']] ?? null,
                'district'   => $rawDistrict,
                'province'   => $this->normalizeProvince($rawProvince, $rawDistrict),
                'created_at' => $now,
                'updated_at' => $now,
            ];

            if (count($chunk) === 500) {
                DB::table('schools')->insert($chunk);
                $count += count($chunk);
                $chunk  = [];
            }
        }

        if (!empty($chunk)) {
            DB::table('schools')->insert($chunk);
            $count += count($chunk);
        }

        fclose($handle);

        $this->command->info("Berhasil import {$count} sekolah.");
    }
}
