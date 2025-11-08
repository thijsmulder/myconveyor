<?php

use App\Http\Controllers\LocationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\CategoryController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::resource('users', \App\Http\Controllers\UserController::class);

    // Equipment detail route first
    Route::get('/locations/{location:slug}/{equipment:slug}', [LocationController::class, 'showEquipment'])
        ->name('locations.equipments.show');

    // Single location route
    Route::get('/locations/{location:slug}', [LocationController::class, 'show'])
        ->name('locations.show');

    // Resource routes excluding 'show'
    Route::resource('locations', LocationController::class)->except(['show']);

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
