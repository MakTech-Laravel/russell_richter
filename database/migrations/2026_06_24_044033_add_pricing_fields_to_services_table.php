<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('service_type')->default('package')->after('slug');
            $table->json('features')->nullable()->after('description');
            $table->boolean('is_popular')->default(false)->after('is_active');
            $table->string('price_label')->nullable()->after('base_price');
            $table->string('addon_note')->nullable()->after('price_label');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'service_type',
                'features',
                'is_popular',
                'price_label',
                'addon_note',
            ]);
        });
    }
};
