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

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->uuid('recipient_id');
            $table->foreign('recipient_id')->references('ssid')->on('users')->onDelete('cascade');
            $table->string('type'); // e.g., review_critical
            $table->unsignedBigInteger('related_id')->nullable();
            $table->text('message');
            $table->enum('channel', ['whatsapp', 'in_app']);
            $table->boolean('is_read')->default(false);
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });

        Schema::create('notification_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notification_id')->constrained('notifications')->onDelete('cascade');
            $table->enum('status', ['sent', 'failed']);
            $table->text('failure_reason')->nullable();
            $table->timestamp('attempted_at')->useCurrent();
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
        Schema::dropIfExists('notification_logs');
        Schema::dropIfExists('notifications');
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn('is_critical');
        });
    }
};
