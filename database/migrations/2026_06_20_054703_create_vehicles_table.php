<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('vin', 17);
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('make')->nullable();
            $table->string('model')->nullable();
            $table->string('trim')->nullable();
            $table->string('engine')->nullable();
            $table->string('fuel_type')->nullable();
            $table->string('body_class')->nullable();
            $table->string('drive_type')->nullable();
            $table->unsignedInteger('mileage')->nullable();
            $table->string('license_plate')->nullable();
            $table->string('color')->nullable();
            $table->json('vin_decode_data')->nullable();
            $table->timestamp('decoded_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'vin']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
