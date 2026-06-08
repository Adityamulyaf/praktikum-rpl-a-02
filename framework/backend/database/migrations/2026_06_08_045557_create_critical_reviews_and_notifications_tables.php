<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->boolean('is_critical')->default(false)->after('photo');
        });



        Schema::create('critical_review_followups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('review_id')->unique()->constrained('reviews')->onDelete('cascade');
            $table->foreignId('sppg_id')->constrained('sppg_profiles')->onDelete('cascade');
            $table->enum('followup_status', ['belum_diproses', 'dalam_proses', 'selesai'])->default('belum_diproses');
            $table->text('handling_note')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('ssid')->on('users')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('followup_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('followup_id')->constrained('critical_review_followups')->onDelete('cascade');
            $table->enum('previous_status', ['belum_diproses', 'dalam_proses', 'selesai']);
            $table->enum('new_status', ['belum_diproses', 'dalam_proses', 'selesai']);
            $table->text('note')->nullable();
            $table->uuid('changed_by');
            $table->foreign('changed_by')->references('ssid')->on('users')->onDelete('cascade');
            $table->timestamp('changed_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('followup_histories');
        Schema::dropIfExists('critical_review_followups');
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn('is_critical');
        });
    }
};
