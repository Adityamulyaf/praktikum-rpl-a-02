<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiValidationService
{
    /**
     * Memvalidasi kewajaran nutrisi makanan berdasarkan klaim dan foto base64 (opsional).
     *
     * @param array $menuData
     * @param string|null $photoBase64  Data URL base64 gambar (mis. "data:image/jpeg;base64,...") atau null jika tidak ada foto
     * @return array  ['is_valid' => bool, 'warning_message' => string|null]
     */
    public function validateNutrition(array $menuData, ?string $photoBase64 = null): array
    {
        $apiKey = config('services.gemini.key');

        // Skenario jika API Key belum dikonfigurasi (fallback wajar tanpa error)
        if (!$apiKey) {
            Log::warning('Gemini API Key is not configured. Skipping AI validation.');
            return [
                'is_valid' => false,
                'warning_message' => null
            ];
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={$apiKey}";

        $hasPhoto = !empty($photoBase64);

        // Susun prompt sesuai dengan ada/tidak-nya foto
        if ($hasPhoto) {
            $prompt = "Anda adalah asisten ahli gizi profesional untuk program Makan Bergizi Gratis (MBG).
Tugas Anda adalah memvalidasi kesesuaian secara visual antara klaim nutrisi makanan yang diinput oleh dapur dengan foto makanan nyata yang diunggah.

Berikut adalah data klaim nutrisi yang diinput:
- Nama Menu: {$menuData['menu_name']}
- Komponen Makanan: " . ($menuData['components'] ?? '-') . "
- Energi/Kalori: " . ($menuData['calories'] ?? 0) . " kkal
- Protein: " . ($menuData['protein'] ?? 0) . " gram
- Karbohidrat: " . ($menuData['carbs'] ?? 0) . " gram
- Lemak: " . ($menuData['fat'] ?? 0) . " gram

Instruksi Analisis:
1. Periksa foto makanan yang dilampirkan. Lakukan estimasi visual terhadap ukuran porsi, jenis makanan, dan komposisi gizi makro yang terlihat.
2. Bandingkan porsi dan jenis makanan pada foto dengan nilai nutrisi yang diklaim di atas.
3. Tentukan apakah klaim tersebut wajar dan realistis secara visual. Anda harus kritis terhadap ketidakwajaran yang mencolok (misalnya porsi sangat kecil tetapi kalori diklaim sangat besar, atau protein sangat tinggi tapi tidak ada lauk hewani/nabati yang terlihat).
4. Jika tidak wajar secara signifikan, set \"is_valid\" menjadi false dan berikan pesan peringatan \"warning_message\" yang spesifik dan konstruktif dalam Bahasa Indonesia.
5. Jika wajar secara visual, set \"is_valid\" menjadi true dan \"warning_message\" menjadi string kosong \"\".";
        } else {
            $prompt = "Anda adalah asisten ahli gizi profesional untuk program Makan Bergizi Gratis (MBG).
Tugas Anda adalah memvalidasi kewajaran klaim nilai nutrisi makanan berdasarkan data yang diinput.

Berikut adalah data klaim nutrisi yang diinput:
- Nama Menu: {$menuData['menu_name']}
- Komponen Makanan: " . ($menuData['components'] ?? '-') . "
- Energi/Kalori: " . ($menuData['calories'] ?? 0) . " kkal
- Protein: " . ($menuData['protein'] ?? 0) . " gram
- Karbohidrat: " . ($menuData['carbs'] ?? 0) . " gram
- Lemak: " . ($menuData['fat'] ?? 0) . " gram

Instruksi Analisis:
1. Periksa apakah nilai nutrisi yang diklaim masuk akal untuk menu makanan anak sekolah (usia 6-18 tahun) untuk satu kali makan siang.
2. Periksa apakah nilai kalori, protein, karbohidrat, dan lemak konsisten satu sama lain (kalori ≈ protein×4 + karbohidrat×4 + lemak×9).
3. Periksa apakah komponen makanan yang disebutkan secara wajar dapat menghasilkan nilai nutrisi yang diklaim.
4. Jika ada ketidakwajaran yang signifikan, set \"is_valid\" menjadi false dan berikan pesan \"warning_message\" yang spesifik dalam Bahasa Indonesia.
5. Jika wajar, set \"is_valid\" menjadi true dan \"warning_message\" menjadi string kosong \"\".";
        }

        // Bangun array parts — teks selalu ada, gambar hanya jika ada foto
        $parts = [['text' => $prompt]];

        if ($hasPhoto) {
            $mimeType = 'image/jpeg';
            $rawBase64 = $photoBase64;

            // Bersihkan prefix data URL jika dikirim langsung dari Canvas / FileReader
            if (preg_match('/^data:image\/(\w+);base64,/', $photoBase64, $matches)) {
                $rawBase64 = substr($photoBase64, strpos($photoBase64, ',') + 1);
                $mimeType = 'image/' . $matches[1];
            }

            $parts[] = [
                'inlineData' => [
                    'mimeType' => $mimeType,
                    'data' => $rawBase64
                ]
            ];
        }

        try {
            $response = Http::timeout(30)->post($url, [
                'contents' => [
                    [
                        'parts' => $parts
                    ]
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                    'responseSchema' => [
                        'type' => 'OBJECT',
                        'properties' => [
                            'is_valid' => ['type' => 'BOOLEAN'],
                            'warning_message' => ['type' => 'STRING'],
                        ],
                        'required' => ['is_valid', 'warning_message']
                    ]
                ]
            ]);

            if ($response->successful()) {
                $responseText = $response->json('candidates.0.content.parts.0.text');
                $result = json_decode($responseText, true);

                if (is_array($result) && isset($result['is_valid'])) {
                    // Normalkan: warning_message null/empty string → null
                    if (empty($result['warning_message'])) {
                        $result['warning_message'] = null;
                    }
                    Log::info('Gemini validation result', [
                        'menu' => $menuData['menu_name'],
                        'is_valid' => $result['is_valid'],
                        'has_photo' => $hasPhoto,
                    ]);
                    return $result;
                }

                Log::warning('Gemini returned unexpected JSON structure', ['body' => $response->body()]);
            } else {
                Log::error('Gemini API Response Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Gemini Service Exception: ' . $e->getMessage());
        }

        // Fallback: Jika API down/koneksi putus, status is_valid=false dengan warning null (Belum Divalidasi)
        return [
            'is_valid' => false,
            'warning_message' => null
        ];
    }
}
