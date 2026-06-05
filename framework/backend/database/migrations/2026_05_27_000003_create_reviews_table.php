<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('ssid')->on('users')->onDelete('cascade');
            $table->foreignId('school_id')->constrained()->onDelete('cascade');
            $table->date('review_date');
            $table->text('content');
            $table->enum('flag_status', ['none', 'flagged', 'deleted'])->default('none');
            $table->text('flag_reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
