<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sppg_schools', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sppg_id')->constrained('sppg_profiles')->onDelete('cascade');
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['sppg_id', 'school_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sppg_schools');
    }
};
