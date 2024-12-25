<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Fashion',
                'slug' => 'fashion',
            ],
            [
                'name' => 'makanan',
                'slug' => 'makanan',
            ],
            [
                'name' => 'Elektronik',
                'slug' => 'elektronik',
            ],
            [
                'name' => 'Kesehatan & Kecantikan',
                'slug' => 'kesehatan-kecantikan',
            ],
            [
                'name' => 'aksesoris',
                'slug' => 'aksesoris',
            ],
            [
                'name' => 'Otomotif',
                'slug' => 'otomotif',
            ],
            [
                'name' => 'Properti',
                'slug' => 'properti',
            ],
            [
                'name' => 'Hobi & Hiburan',
                'slug' => 'hobi-hiburan',
            ],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insert($category);
        }
    }
}
