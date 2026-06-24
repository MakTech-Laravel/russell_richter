<?php

use App\Http\Controllers\Backend\Technician\TechnicianJobController;
use App\Http\Controllers\Backend\Technician\TechnicianLoginController;
use Illuminate\Support\Facades\Route;

Route::prefix('technician')->name('technician.')->group(function () {
    Route::middleware('guest:technician')->group(function () {
        Route::get('/login', [TechnicianLoginController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [TechnicianLoginController::class, 'login'])->name('login.store');
    });

    Route::middleware(['technician'])->group(function () {
        Route::post('/logout', [TechnicianLoginController::class, 'logout'])->name('logout');
        Route::get('/jobs', [TechnicianJobController::class, 'index'])->name('jobs.index');
        Route::get('/jobs/history', [TechnicianJobController::class, 'history'])->name('jobs.history');
        Route::get('/jobs/{booking}', [TechnicianJobController::class, 'show'])->name('jobs.show');
        Route::patch('/jobs/{booking}', [TechnicianJobController::class, 'updateStatus'])->name('jobs.update');
    });
});
