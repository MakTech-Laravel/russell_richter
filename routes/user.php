<?php

use App\Http\Controllers\Backend\User\BookingController;
use App\Http\Controllers\Backend\User\BookingPaymentController;
use App\Http\Controllers\Backend\User\ServiceHistoryController;
use App\Http\Controllers\Backend\User\TransactionController;
use App\Http\Controllers\Backend\User\UserDashboardController;
use App\Http\Controllers\Backend\User\VehicleController;
use App\Http\Controllers\Backend\User\VinDecodeController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [UserProfileController::class, 'edit'])->name('user-profile.edit');
    Route::post('/profile', [UserProfileController::class, 'update'])->name('user-profile.update');

    Route::resource('vehicles', VehicleController::class);
    Route::resource('bookings', BookingController::class)->except(['edit', 'update']);
    Route::get('/bookings/{booking}/edit', [BookingController::class, 'edit'])->name('bookings.edit');
    Route::put('/bookings/{booking}', [BookingController::class, 'update'])->name('bookings.update');

    Route::post('/bookings/{booking}/checkout', [BookingPaymentController::class, 'checkout'])->name('bookings.payment.checkout');
    Route::get('/bookings/{booking}/payment/success', [BookingPaymentController::class, 'success'])->name('bookings.payment.success');
    Route::get('/bookings/{booking}/payment/cancel', [BookingPaymentController::class, 'cancel'])->name('bookings.payment.cancel');

    Route::get('/service-history', [ServiceHistoryController::class, 'index'])->name('service-history.index');
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/vin/decode', VinDecodeController::class)->name('vin.decode');
});
