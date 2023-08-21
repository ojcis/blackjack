<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BlackjackController;
use App\Http\Controllers\SlotMachineController;
use App\Http\Controllers\BalanceController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/balance/update', [BalanceController::class, 'update'])->name('balance.update');

    Route::get('/blackjack', [BlackjackController::class, 'play'])->name('blackjack.play');
    Route::get('/slotmachine', [SlotMachineController::class, 'play'])->name('slotmachine.play');
});

require __DIR__.'/auth.php';
