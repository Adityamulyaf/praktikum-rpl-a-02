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
        Schema::create('ai_sentiment_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sppg_id')->constrained('sppg_profiles')->onDelete('cascade');
            $table->date('summary_date');
            $table->integer('total_reviews')->default(0);
            $table->integer('positive_count')->default(0);
            $table->integer('neutral_count')->default(0);
            $table->integer('negative_count')->default(0);
            $table->text('key_points')->nullable();
            $table->timestamps();

            // Sppg and date must be unique together
            $table->unique(['sppg_id', 'summary_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_sentiment_summaries');
    }
};
