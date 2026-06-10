<?php

namespace App\Console\Commands;

use App\Models\AiSentimentSummary;
use App\Models\Review;
use App\Models\SppgProfile;
use App\Services\GeminiSentimentService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateDailySentimentSummary extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sppg:generate-sentiment
                            {--date= : Tanggal ulasan yang dievaluasi (format Y-m-d, default: hari ini)}
                            {--dry-run : Menampilkan ulasan tanpa menyimpan ke database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Menghasilkan ringkasan sentimen ulasan harian per dapur SPPG menggunakan Gemini AI';

    /**
     * Execute the console command.
     */
    public function handle(GeminiSentimentService $sentimentService): int
    {
        $date = $this->option('date') ?? Carbon::now('Asia/Jakarta')->toDateString();
        $dryRun = (bool) $this->option('dry-run');

        $this->info("Memulai analisis sentimen harian untuk tanggal {$date}...");

        $sppgs = SppgProfile::where('is_active', true)->get();

        if ($sppgs->isEmpty()) {
            $this->warn('Tidak ada dapur SPPG aktif yang ditemukan.');
            return self::SUCCESS;
        }

        foreach ($sppgs as $sppg) {
            $this->info("Menganalisis Dapur: {$sppg->kitchen_name}");

            // Ambil semua ulasan untuk tanggal ini yang berstatus publik (flag_status = 'none')
            $reviews = Review::where('sppg_id', $sppg->id)
                ->where('review_date', $date)
                ->where('flag_status', 'none')
                ->get();

            $totalReviews = $reviews->count();
            $this->line(" - Ditemukan {$totalReviews} ulasan aktif.");

            if ($totalReviews === 0) {
                if (!$dryRun) {
                    // Hapus jika sebelumnya ada ulasan tapi sekarang sudah dihapus/dflag
                    AiSentimentSummary::where('sppg_id', $sppg->id)
                        ->where('summary_date', $date)
                        ->delete();
                }
                $this->line(" - Tidak ada ulasan aktif untuk tanggal ini. Melewati penyimpanan.");
                continue;
            }

            $reviewTexts = $reviews->pluck('content')->toArray();
            $analysisResult = $sentimentService->analyzeSentiment($reviewTexts);

            if ($dryRun) {
                $this->line("   [Dry-run] Hasil Analisis:");
                $this->line("   - Positif: {$analysisResult['positive_count']}");
                $this->line("   - Netral:  {$analysisResult['neutral_count']}");
                $this->line("   - Negatif: {$analysisResult['negative_count']}");
                $this->line("   - Poin-poin:\n" . $analysisResult['key_points']);
            } else {
                // Simpan atau update ke database
                AiSentimentSummary::updateOrCreate(
                    [
                        'sppg_id' => $sppg->id,
                        'summary_date' => $date,
                    ],
                    [
                        'total_reviews' => $totalReviews,
                        'positive_count' => $analysisResult['positive_count'],
                        'neutral_count' => $analysisResult['neutral_count'],
                        'negative_count' => $analysisResult['negative_count'],
                        'key_points' => $analysisResult['key_points'],
                    ]
                );
                $this->info(" - Berhasil menyimpan evaluasi harian untuk {$sppg->kitchen_name}.");
            }
        }

        $this->info("Analisis sentimen harian selesai untuk tanggal {$date}.");
        return self::SUCCESS;
    }
}
