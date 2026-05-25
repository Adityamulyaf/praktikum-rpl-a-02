<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SchoolSeeder extends Seeder
{
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
            $chunk[] = [
                'name'       => $row[$colIndex['sekolah']] ?? '',
                'address'    => $row[$colIndex['alamat_jalan']] ?? null,
                'district'   => $row[$colIndex['kabupaten_kota']] ?? '',
                'province'   => $row[$colIndex['propinsi']] ?? '',
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
