<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->string('part_type');
            $table->string('part_name');
            $table->string('part_number')->nullable();
            $table->string('specification')->nullable();
            $table->unsignedSmallInteger('quantity')->default(1);
            $table->decimal('estimated_price', 8, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_recommendations');
    }
};
