<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('oil_fitments', function (Blueprint $table) {
            $table->id();
            $table->string('make', 100);
            $table->string('model', 100);
            $table->unsignedSmallInteger('year_from');
            $table->unsignedSmallInteger('year_to');
            $table->string('engine', 100)->nullable();
            $table->string('oil_filter_part_no', 60);
            $table->string('oil_filter_brand', 100)->nullable();
            $table->string('oil_grade', 20);
            $table->decimal('oil_capacity_quarts', 4, 2);
            $table->boolean('supports_synthetic')->default(true);
            $table->timestamps();

            $table->index(['make', 'model', 'year_from', 'year_to'], 'oil_fitments_lookup');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('oil_fitments');
    }
};
