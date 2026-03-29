<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder {
    public function run(): void {
        $roles = ['admin', 'seller', 'customer', 'shipper', 'linehaul'];

        foreach ($roles as $role) {
            foreach (range(1, 2) as $i) {
                User::create([
                    'name' => ucfirst($role) . " Node $i",
                    'email' => "{$role}{$i}@shopdee.io.vn",
                    'password' => Hash::make('password'),
                    'role' => $role,
                    'trust_score' => 100.00,
                    'is_online' => false,
                ]);
            }
        }
    }
}
