<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('distribution_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sppg_id')->constrained('sppg_profiles')->onDelete('cascade');
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->date('distributed_at');
            $table->enum('status', ['belum_diantar', 'siap_diantar', 'sudah_diantar', 'batal'])
                  ->default('belum_diantar');
            $table->timestamp('status_updated_at')->nullable();
            $table->timestamps();

            $table->unique(['sppg_id', 'school_id', 'distributed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('distribution_statuses');
    }
};
