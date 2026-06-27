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
        Schema::table('booking_recommendations', function (Blueprint $table) {
            $table->decimal('quantity', 5, 2)->default(1)->unsigned()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_recommendations', function (Blueprint $table) {
            $table->smallInteger('quantity')->unsigned()->default(1)->change();
        });
    }
};
