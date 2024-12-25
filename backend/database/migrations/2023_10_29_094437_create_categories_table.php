<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->timestamps();
        });

        Schema::table('products', function (Blueprint $table) {
            // Menambahkan kolom 'category_id' dengan foreign key ke tabel 'categories'
            $table->dropColumn('category');
            $table->unsignedBigInteger('category_id')->nullable();
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Menghapus foreign key dan kolom 'category_id'
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
            $table->string('category');
        });
        Schema::dropIfExists('categories');
    }
};
