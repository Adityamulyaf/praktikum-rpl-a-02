<?php

namespace App\Console\Commands;

use App\Models\DistributionStatus;
use App\Models\School;
use App\Models\TeacherProfile;
use App\Models\User;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckLateDistribution extends Command
{
    protected $signature = 'distribution:check-late
                            {--date= : Date to check in Y-m-d format (default: today)}
                            {--dry-run : Run without sending notifications}';

    protected $description = 'Check for distributions not updated to Terkirim by 11:00 WIB and notify Admin + Guru';

    public function handle(NotificationService $notificationService): int
    {
        $date = $this->option('date') ?? Carbon::now('Asia/Jakarta')->toDateString();
        $dryRun = (bool) $this->option('dry-run');

        $this->info("Checking late distributions for {$date}...");

        // Find all distribution statuses for the date that are NOT 'sudah_diantar'
        $lateDistributions = DistributionStatus::where('distributed_at', $date)
            ->where('status', '!=', 'sudah_diantar')
            ->with(['school', 'sppg'])
            ->get();

        if ($lateDistributions->isEmpty()) {
            $this->info('No late distributions found.');
            return self::SUCCESS;
        }

        $this->info("Found {$lateDistributions->count()} late distribution(s).");

        if ($dryRun) {
            $lateDistributions->each(function ($d) {
                $this->line("  - {$d->school->name} (Dapur: {$d->sppg->kitchen_name}) – Status: {$d->status}");
            });
            $this->warn('Dry run – no notifications sent.');
            return self::SUCCESS;
        }

        // Group by SPPG for efficient notification
        $bySppg = $lateDistributions->groupBy('sppg_id');
        $totalNotifs = 0;

        foreach ($bySppg as $sppgId => $distributions) {
            $sppg = $distributions->first()->sppg;
            $schoolNames = $distributions->map(fn ($d) => $d->school->name)->implode(', ');

            $title = 'Distribusi Terlambat';
            $body  = "Distribusi makanan dari dapur *{$sppg->kitchen_name}* untuk sekolah berikut belum berstatus Terkirim hingga pukul 11.00 WIB: {$schoolNames}. Segera lakukan tindak lanjut.";

            $data = [
                'sppg_id'     => $sppgId,
                'date'        => $date,
                'school_ids'  => $distributions->pluck('school_id')->toArray(),
                'kitchen_name' => $sppg->kitchen_name,
            ];

            // 1. Notify all Admins
            $adminIds = User::where('role', 'admin')->where('is_active', true)->pluck('ssid')->toArray();
            foreach ($adminIds as $adminId) {
                $notificationService->notify($adminId, 'late_distribution', $title, $body, $data);
                $totalNotifs++;
            }

            // 2. Notify all Guru whose school is in the late list
            $lateSchoolIds = $distributions->pluck('school_id')->toArray();
            $guruUserIds = TeacherProfile::whereIn('school_id', $lateSchoolIds)
                ->pluck('user_id')
                ->toArray();

            foreach ($guruUserIds as $guruId) {
                // Personalize message for each guru
                $guruProfile = TeacherProfile::where('user_id', $guruId)->first();
                $guruSchool = $guruProfile?->school;
                if ($guruSchool) {
                    $guruBody = "Distribusi makanan dari dapur *{$sppg->kitchen_name}* ke sekolah Anda (*{$guruSchool->name}*) belum berstatus Terkirim hingga pukul 11.00 WIB. Silakan menindaklanjuti.";
                } else {
                    $guruBody = $body;
                }

                $notificationService->notify($guruId, 'late_distribution', $title, $guruBody, $data);
                $totalNotifs++;
            }
        }

        $this->info("Sent {$totalNotifs} notification(s).");
        Log::info('CheckLateDistribution completed', [
            'date'         => $date,
            'late_count'   => $lateDistributions->count(),
            'notif_count'  => $totalNotifs,
        ]);

        return self::SUCCESS;
    }
}
