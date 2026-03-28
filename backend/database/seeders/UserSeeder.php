<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder {
    public function run(): void {
        // --- 1. ADMIN / AI ACCOUNT ---
        User::create([
            'name' => 'AI Sandbox Controller',
            'email' => 'admin@shopdee.io.vn',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'trust_score' => 100.00,
        ]);

        // --- 2. MULTIPLE CUSTOMERS ---
        foreach(range(1, 5) as $i) {
            User::create([
                'name' => "Customer One $i",
                'email' => "customer$i@shopdee.io.vn",
                'password' => Hash::make('password'),
                'role' => 'customer',
                'trust_score' => 100.00,
            ]);
        }

        // --- 3. SELLERS (SHOPS) ---
        foreach(range(1, 3) as $i) {
            User::create([
                'name' => "Shop Owner Alpha $i",
                'email' => "seller$i@shopdee.io.vn",
                'password' => Hash::make('password'),
                'role' => 'seller',
                'trust_score' => 100.00,
            ]);
        }

        // --- 4. SHIPPERS (LAST-MILE) ---
        foreach(range(1, 5) as $i) {
            User::create([
                'name' => "Shipper Speed $i",
                'email' => "shipper$i@shopdee.io.vn",
                'password' => Hash::make('password'),
                'role' => 'shipper',
                'trust_score' => rand(85, 100),
            ]);
        }

        // --- 5. LINEHAUL DRIVERS ---
        foreach(range(1, 2) as $i) {
            User::create([
                'name' => "Linehaul Express $i",
                'email' => "linehaul$i@shopdee.io.vn",
                'password' => Hash::make('password'),
                'role' => 'linehaul',
                'trust_score' => 100.00,
            ]);
        }
    }
}
