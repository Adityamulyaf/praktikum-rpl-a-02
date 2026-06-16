<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\SppgProfile as SppgProfileModel;
use Illuminate\Database\Seeder;

class SppgProfile extends Seeder
{
    public function run(): void
    {
        $sppgUsers = User::where('role', 'sppg')->get(['ssid']);

        if ($sppgUsers->isEmpty()) {
            $this->command->warn('Tidak ada SPPG user ditemukan.');
            return;
        }

        $csvFile = database_path('seeders/data/sppg.csv');

        if (!file_exists($csvFile)) {
            $this->command->error("File CSV tidak ditemukan: {$csvFile}");
            return;
        }

        // Delete existing SPPG profiles to avoid conflicts
        SppgProfileModel::truncate();

        $file = fopen($csvFile, 'r');
        $header = null;
        $userIndex = 0;
        $count = 0;
        $profilesToCreate = [];
        $batchSize = 100;

        while (($row = fgetcsv($file)) !== false) {
            // Skip header row on first iteration
            if ($header === null) {
                $header = $row;
                continue;
            }

            // Skip duplicate headers that appear in the CSV (identified by first column being 'No')
            if (isset($row[0]) && trim($row[0]) === 'No') {
                continue;
            }

            // Skip empty rows
            if (empty(array_filter($row))) {
                continue;
            }

            // Check if this is a valid data row by ensuring the first column has a number
            $rowNum = trim($row[0] ?? '');
            if (!is_numeric($rowNum) || $rowNum === '') {
                continue;
            }

            $data = array_combine($header, $row);

            // Get unique SPPG user for this CSV row
            $sppgUser = $sppgUsers[$userIndex % $sppgUsers->count()];
            $userIndex++;

            $profilesToCreate[] = [
                'user_id'               => $sppgUser->ssid,
                'kitchen_name'          => trim($data['Nama SPPG'] ?? 'SPPG #' . $rowNum),
                'address'               => trim($data['Alamat SPPG'] ?? 'Alamat tidak tersedia'),
                'district'              => trim($data['Kecamatan SPPG'] ?? 'District tidak tersedia'),
                'city'                  => trim($data['Kab./Kota SPPG'] ?? 'City tidak tersedia'),
                'province'              => trim($data['Provinsi SPPG'] ?? 'Province tidak tersedia'),
                'contact_person_name'   => 'Contact ' . $rowNum,
                'contact_phone'         => '08' . str_pad($rowNum, 10, '0', STR_PAD_LEFT),
                'contact_email'         => 'sppg' . $rowNum . '@halombg.com',
                'description'           => trim($data['Nama SPPG'] ?? 'SPPG Profile #' . $rowNum),
                'production_capacity'   => 1000 + ($rowNum * 10),
                'is_active'             => true,
                'created_at'            => now(),
                'updated_at'            => now(),
            ];

            $count++;

            // Insert in batches for performance
            if (count($profilesToCreate) >= $batchSize) {
                SppgProfileModel::insert($profilesToCreate);
                $this->command->info("Telah membuat {$count} SPPG profiles...");
                $profilesToCreate = [];
            }
        }

        // Insert remaining records
        if (!empty($profilesToCreate)) {
            SppgProfileModel::insert($profilesToCreate);
        }

        fclose($file);
        $this->command->info("Berhasil membuat {$count} SPPG profiles dari CSV.");
    }
}
