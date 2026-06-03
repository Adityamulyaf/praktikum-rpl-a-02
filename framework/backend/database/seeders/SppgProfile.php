<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\SppgProfile as SppgProfileModel;
use Illuminate\Database\Seeder;

class SppgProfile extends Seeder
{
    public function run(): void
    {
        $sppgUsers = User::where('role', 'sppg')->get();

        if ($sppgUsers->isEmpty()) {
            $this->command->warn('Tidak ada SPPG user ditemukan.');
            return;
        }

        $count = 0;
        $kitchens = [
            'Dapur Emas', 'Rumah Makan Sejahtera', 'Warung Mak Yah', 'Katering Lezat',
            'Dapur Tradisional', 'Kafe Santai', 'Restoran Keluarga', 'Hidangan Nusantara',
            'Toko Kue Amanah', 'Bakery Premium', 'Warung Pinggir Jalan', 'Restoran Mewah',
            'Kedai Kopi Mantap', 'Rumah Makan Rakyat', 'Dapur Ibu', 'Kantin Sehat'
        ];

        $districts = ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur'];
        $provinces = ['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Sumatera Utara'];

        for ($i = 0; $i < 1000; $i++) {
            $sppgUser = $sppgUsers[$i % $sppgUsers->count()];
            $kitchenIndex = $i % count($kitchens);

            SppgProfileModel::updateOrCreate(
                ['user_id' => $sppgUser->ssid],
                [
                    'kitchen_name'          => $kitchens[$kitchenIndex] . ' ' . ($i + 1),
                    'address'               => 'Jl. Test No. ' . ($i + 1),
                    'district'              => $districts[$i % count($districts)],
                    'province'              => $provinces[$i % count($provinces)],
                    'contact_person_name'   => 'Contact ' . ($i + 1),
                    'contact_phone'         => '08' . str_pad($i + 1, 10, '0', STR_PAD_LEFT),
                    'contact_email'         => 'sppg' . ($i + 1) . '@halombg.com',
                    'description'           => 'SPPG Profile #' . ($i + 1),
                    'production_capacity'   => 1000 + ($i * 10),
                    'is_active'             => true,
                ]
            );

            $count++;
            if ($count % 100 === 0) {
                $this->command->info("Telah membuat {$count} SPPG profiles...");
            }
        }

        $this->command->info("Berhasil membuat {$count} SPPG profiles.");
    }
}
