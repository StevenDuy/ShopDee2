<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder {
    public function run(): void {
        $roles = [
            'admin' => 'Administrator',
            'seller' => 'Shop Owner',
            'customer' => 'Customer',
            'shipper' => 'Local Shipper',
            'linehaul' => 'Linehaul Driver'
        ];

        $roleModels = [];
        foreach ($roles as $name => $displayName) {
            $roleModels[$name] = \App\Models\Role::updateOrCreate(
                ['name' => $name],
                ['display_name' => $displayName]
            );
        }

        // 1. Create a Primary Admin for Testing
        User::updateOrCreate(
            ['email' => 'admin@shopdee.io.vn'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password'),
                'role_id' => $roleModels['admin']->id,
                'trust_score' => 100.00,
            ]
        );

        // 2. Create Bulk Test Users
        foreach ($roles as $roleName => $displayName) {
            foreach (range(1, 2) as $i) {
                User::updateOrCreate(
                    ['email' => "{$roleName}{$i}@shopdee.io.vn"],
                    [
                        'name' => "{$displayName} $i",
                        'password' => Hash::make('password'),
                        'role_id' => $roleModels[$roleName]->id,
                        'trust_score' => 100.00,
                        'is_online' => false,
                    ]
                );
            }
        }
    }
}
