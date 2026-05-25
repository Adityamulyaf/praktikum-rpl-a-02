<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sppg_profiles', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id')->unique();
            $table->foreign('user_id')->references('ssid')->on('users')->onDelete('cascade');
            $table->string('kitchen_name');
            $table->text('address');
            $table->string('district');
            $table->string('province');
            $table->string('contact_person_name');
            $table->string('contact_phone');
            $table->string('contact_email')->nullable();
            $table->text('description')->nullable();
            $table->integer('production_capacity')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sppg_profiles');
    }
};
