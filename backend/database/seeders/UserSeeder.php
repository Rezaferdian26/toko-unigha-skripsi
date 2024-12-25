<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        $admin = User::create([
            'id' => Str::uuid(),
            'name' => 'Admin',
            'username' => 'admin',
            'password' => bcrypt('toko-unigha-admin'),
            'email' => 'admin@tokounigha.com',
            'phone' => '-',
            'address' => '-',
        ]);

        $admin->assignRole('admin');
    }
}
