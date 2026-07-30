<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->unsignedTinyInteger('extra_quarts')->default(0)->after('total_price');
            $table->decimal('extra_quarts_amount', 8, 2)->default(0)->after('extra_quarts');
            $table->decimal('extra_charge_amount', 8, 2)->default(0)->after('extra_quarts_amount');
            $table->string('extra_charge_label')->nullable()->after('extra_charge_amount');
            $table->decimal('discount_percent', 5, 2)->default(0)->after('extra_charge_label');
            $table->decimal('discount_amount', 8, 2)->default(0)->after('discount_percent');
            $table->decimal('package_price', 8, 2)->nullable()->after('discount_amount');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'extra_quarts',
                'extra_quarts_amount',
                'extra_charge_amount',
                'extra_charge_label',
                'discount_percent',
                'discount_amount',
                'package_price',
            ]);
        });
    }
};
