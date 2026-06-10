<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiSentimentService
{
    /**
     * Menganalisis kumpulan teks ulasan siswa untuk menghasilkan sentimen dan poin penting.
     *
     * @param array $reviews  Array dari string ulasan siswa (misal: ["makanannya enak", "porsi agak sedikit", ...])
     * @return array          ['positive_count' => int, 'neutral_count' => int, 'negative_count' => int, 'key_points' => string]
     */
    public function analyzeSentiment(array $reviews): array
    {
        // Jika tidak ada ulasan, kembalikan data kosong secara instan untuk menghemat kuota API
        if (empty($reviews)) {
            return [
                'positive_count' => 0,
                'neutral_count'  => 0,
                'negative_count' => 0,
                'key_points'     => 'Belum ada ulasan untuk tanggal ini.',
            ];
        }

        $apiKey = config('services.gemini.key');

        if (!$apiKey) {
            Log::warning('Gemini API Key is not configured. Skipping sentiment analysis.');
            // Fallback wajar (menggunakan klasifikasi sederhana sebagai representasi darurat)
            return $this->fallbackAnalysis($reviews);
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={$apiKey}";

        // Susun daftar ulasan ke dalam format teks terurut untuk dikirim ke prompt
        $reviewsText = "";
        foreach ($reviews as $idx => $review) {
            $num = $idx + 1;
            $reviewsText .= "{$num}. \"{$review}\"\n";
        }

        $prompt = "Anda adalah AI analis sentimen untuk program Makan Bergizi Gratis (MBG) di Indonesia.
Tugas Anda adalah membaca kumpulan ulasan siswa tentang makanan yang disajikan oleh dapur penyedia hari ini, lalu menganalisis sentimen dan poin-poin penting dari ulasan tersebut.

Berikut adalah daftar ulasan siswa:
{$reviewsText}

Instruksi Analisis:
1. Baca dan klasifikasikan setiap ulasan ke salah satu dari kategori sentimen berikut: Positif (senang, memuji, puas), Netral (deskriptif tanpa emosi, informasi umum), atau Negatif (kecewa, mengeluh porsi kurang, dingin, rasa hambar, dll.).
2. Hitung jumlah total ulasan untuk masing-masing kategori sentimen (positive_count, neutral_count, negative_count). Pastikan jumlah total dari ketiga sentimen ini sama dengan jumlah ulasan yang diinput (yaitu " . count($reviews) . " ulasan).
3. Buatlah ringkasan poin-poin utama (key_points) dalam Bahasa Indonesia. Ringkasan harus berupa format poin-poin markdown yang rapi, mencakup aspek positif yang banyak disukai, keluhan utama yang muncul, dan saran perbaikan dari siswa (jika ada). Ringkasan harus objektif berdasarkan ulasan di atas.

Kembalikan respons Anda strictly dalam format JSON sesuai dengan skema yang diminta.";

        try {
            $response = Http::timeout(30)->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                    'responseSchema' => [
                        'type' => 'OBJECT',
                        'properties' => [
                            'positive_count' => ['type' => 'INTEGER'],
                            'neutral_count' => ['type' => 'INTEGER'],
                            'negative_count' => ['type' => 'INTEGER'],
                            'key_points' => ['type' => 'STRING'],
                        ],
                        'required' => ['positive_count', 'neutral_count', 'negative_count', 'key_points']
                    ]
                ]
            ]);

            if ($response->successful()) {
                $responseText = $response->json('candidates.0.content.parts.0.text');
                $result = json_decode($responseText, true);

                if (is_array($result) && isset($result['positive_count'])) {
                    Log::info('Gemini sentiment analysis success', [
                        'total_reviews' => count($reviews),
                        'positive' => $result['positive_count'],
                        'neutral' => $result['neutral_count'],
                        'negative' => $result['negative_count']
                    ]);
                    return $result;
                }

                Log::warning('Gemini returned unexpected JSON structure for sentiment', ['body' => $response->body()]);
            } else {
                Log::error('Gemini Sentiment API Response Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Gemini Sentiment Service Exception: ' . $e->getMessage());
        }

        // Fallback jika API bermasalah/down
        return $this->fallbackAnalysis($reviews);
    }

    /**
     * Analisis fallback sederhana (heuristic/rule-based) jika API Gemini tidak terkonfigurasi atau down.
     */
    protected function fallbackAnalysis(array $reviews): array
    {
        $pos = 0;
        $neu = 0;
        $neg = 0;

        $posKeywords = ['enak', 'lezat', 'mantap', 'suka', 'kenyang', 'bagus', 'terima kasih', 'maknyus', 'pas', 'cukup'];
        $negKeywords = ['kurang', 'sedikit', 'dingin', 'asin', 'hambar', 'basi', 'bau', 'busuk', 'kotor', 'keras', 'pahit', 'tidak enak'];

        foreach ($reviews as $review) {
            $text = strtolower($review);
            $hasPos = false;
            $hasNeg = false;

            foreach ($posKeywords as $kw) {
                if (str_contains($text, $kw)) {
                    $hasPos = true;
                    break;
                }
            }

            foreach ($negKeywords as $kw) {
                if (str_contains($text, $kw)) {
                    $hasNeg = true;
                    break;
                }
            }

            if ($hasNeg) {
                $neg++;
            } elseif ($hasPos) {
                $pos++;
            } else {
                $neu++;
            }
        }

        $points = "*Analisis alternatif (Mode Cadangan Non-AI):*\n";
        $points .= "• Total ulasan masuk: " . count($reviews) . " ulasan.\n";
        if ($neg > 0) {
            $points .= "• Terdapat indikasi keluhan siswa mengenai porsi atau rasa makanan (terdeteksi {$neg} ulasan negatif).\n";
        }
        if ($pos > 0) {
            $points .= "• Sebagian siswa menyatakan puas dengan rasa masakan (terdeteksi {$pos} ulasan positif).\n";
        }
        $points .= "• Disarankan untuk terus memantau kualitas rasa dan ketepatan porsi.";

        return [
            'positive_count' => $pos,
            'neutral_count'  => $neu,
            'negative_count' => $neg,
            'key_points'     => $points,
        ];
    }
}
