<?php

use App\Http\Controllers\Frontend\ContactMessageController;
use App\Http\Controllers\Frontend\FrontendController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [FrontendController::class, 'index'])->name('home');
Route::post('/contact-messages', [ContactMessageController::class, 'store'])->name('contact-messages.store');

Route::get('/sign-in', fn () => Inertia::render('auth/portal-select'))->name('sign-in');
