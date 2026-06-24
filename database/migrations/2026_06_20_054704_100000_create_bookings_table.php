<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->constrained()->restrictOnDelete();
            $table->foreignId('technician_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status')->default('pending');
            $table->string('payment_status')->default('unpaid');
            $table->string('stripe_checkout_session_id')->nullable()->unique();
            $table->string('stripe_payment_intent_id')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->dateTime('scheduled_at');
            $table->dateTime('completed_at')->nullable();
            $table->string('service_address');
            $table->string('service_city');
            $table->string('service_state', 2)->default('TX');
            $table->string('service_zip', 10);
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->unsignedInteger('mileage_at_service')->nullable();
            $table->decimal('total_price', 8, 2);
            $table->unsignedSmallInteger('route_order')->nullable();
            $table->text('customer_notes')->nullable();
            $table->text('technician_notes')->nullable();
            $table->timestamps();

            $table->index(['status', 'scheduled_at']);
            $table->index(['technician_id', 'scheduled_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
