<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sppg_id')->constrained('sppg_profiles')->onDelete('cascade');
            $table->date('served_at');
            $table->string('menu_name');
            $table->text('components')->nullable();      // free text: component foods
            $table->integer('calories')->nullable();
            $table->integer('protein')->nullable();      // grams
            $table->integer('carbs')->nullable();        // grams
            $table->integer('fat')->nullable();          // grams
            $table->text('photo')->nullable();           // base64 data url or path of photo
            $table->boolean('is_ai_validated')->default(false);
            $table->text('ai_warning')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_menus');
    }
};
