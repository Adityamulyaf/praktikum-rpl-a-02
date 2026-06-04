<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->foreignId('sppg_id')
                  ->nullable()
                  ->after('school_id')
                  ->constrained('sppg_profiles')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['sppg_id']);
            $table->dropColumn('sppg_id');
        });
    }
};
