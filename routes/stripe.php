<?php

use App\Http\Controllers\Backend\User\BookingPaymentController;
use Illuminate\Support\Facades\Route;

Route::post('/stripe/webhook', [BookingPaymentController::class, 'webhook'])->name('stripe.webhook');
