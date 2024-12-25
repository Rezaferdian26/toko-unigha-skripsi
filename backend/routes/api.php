<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TokoController;
use App\Http\Controllers\UserActivityController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('reset-password/{token}', function ($token) {
    return $token;
})->middleware(['guest:' . config('fortify.guard')])
    ->name('password.reset');

Route::get('/user', [UserController::class, 'index']);
Route::get('/me', [UserController::class, 'getUserLogin'])->middleware('auth:sanctum');
Route::delete('/user/{id}', [UserController::class, 'destroyUser'])->middleware('auth:sanctum');

// Route toko
Route::resource('toko', TokoController::class, [
    'only' => ['index', 'store', 'show', 'update', 'destroy'],
]);
Route::get('get-toko-user', [TokoController::class, 'getTokoUser'])->middleware('auth:sanctum');
Route::post('/toko/{toko}/update-image', [TokoController::class, 'updateImage'])->middleware('auth:sanctum');
Route::get('get-unverified-toko', [TokoController::class, 'getUnVerifiedToko'])->middleware(['auth:sanctum']);
Route::put('/toko/{slug}/verify', [TokoController::class, 'verifyToko'])->middleware(['auth:sanctum']);

// route product
Route::resource('product', ProductController::class, [
    'only' => ['index', 'store', 'show', 'update', 'destroy'],
]);
Route::get('search-product/{keyword}', [ProductController::class, 'search']);
Route::get('product/{toko}/{product}', [ProductController::class, 'showTokoProduct']);
Route::get('show-all-toko-products/{toko}', [ProductController::class, 'showAllTokoProducts']);
Route::get('user-products', [ProductController::class, 'getAllUserProducts']);
Route::get('user-products/{product}', [ProductController::class, 'getUserProductsById']);
Route::delete('product-image/{id}', [ProductController::class, 'deleteImage']);
Route::get('product-by-category/{category}', [ProductController::class, 'getProductByCategory']);


Route::post('landing-page/add-image-banner', [LandingPageController::class, 'addImageBanner'])->middleware(['auth:sanctum']);
Route::get('landing-page', [LandingPageController::class, 'getImages']);
Route::delete('landing-page/{id}', [LandingPageController::class, 'deleteImageBanner'])->middleware('auth:sanctum');

// profile route
Route::put('/profile', [ProfileController::class, 'updateProfile'])->middleware('auth:sanctum');
Route::post('/profile/update-image', [ProfileController::class, 'updateImageProfile'])->middleware('auth:sanctum');

Route::resource('category', CategoryController::class, [
    'only' => ['index', 'store', 'show', 'update', 'destroy'],
]);

// USER ACTIVITY
Route::post('/add-activity', [UserActivityController::class, 'store'])->middleware('auth:sanctum');