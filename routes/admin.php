<?php

use App\Http\Controllers\Backend\Admin\AdminBookingController;
use App\Http\Controllers\Backend\Admin\AdminCustomerController;
use App\Http\Controllers\Backend\Admin\AdminDashboardController;
use App\Http\Controllers\Backend\Admin\AdminLoginController;
use App\Http\Controllers\Backend\Admin\AdminRouteController;
use App\Http\Controllers\Backend\Admin\AdminTechnicianController;
use App\Http\Controllers\Backend\Admin\AdminVehicleController;
use App\Http\Controllers\UserSelectionController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('/login', [AdminLoginController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [AdminLoginController::class, 'login'])->name('login.store');
    });

    Route::middleware(['admin'])->group(function () {
        Route::post('/logout', [AdminLoginController::class, 'logout'])->name('logout');
        Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');

        Route::get('/bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
        Route::get('/bookings/{booking}', [AdminBookingController::class, 'show'])->name('bookings.show');
        Route::patch('/bookings/{booking}', [AdminBookingController::class, 'update'])->name('bookings.update');

        Route::get('/customers', [AdminCustomerController::class, 'index'])->name('customers.index');
        Route::get('/customers/{customer}', [AdminCustomerController::class, 'show'])->name('customers.show');

        Route::get('/vehicles', [AdminVehicleController::class, 'index'])->name('vehicles.index');

        Route::get('/technicians', [AdminTechnicianController::class, 'index'])->name('technicians.index');
        Route::post('/technicians', [AdminTechnicianController::class, 'store'])->name('technicians.store');
        Route::patch('/technicians/{technician}', [AdminTechnicianController::class, 'update'])->name('technicians.update');
        Route::delete('/technicians/{technician}', [AdminTechnicianController::class, 'destroy'])->name('technicians.destroy');

        Route::get('/routes', [AdminRouteController::class, 'index'])->name('routes.index');
        Route::post('/routes/optimize', [AdminRouteController::class, 'optimize'])->name('routes.optimize');

        Route::get('/users/list', [UserSelectionController::class, 'getUsers'])->name('users.list');
    });
});
