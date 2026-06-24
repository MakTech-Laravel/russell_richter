<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('service_type')->default('package');
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('features')->nullable();
            $table->decimal('base_price', 8, 2);
            $table->string('price_label')->nullable();
            $table->string('addon_note')->nullable();
            $table->unsignedSmallInteger('included_quarts')->default(6);
            $table->decimal('additional_quart_price', 8, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_popular')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
