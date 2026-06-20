<?php

namespace Database\Seeders;

use App\Models\Technician;
use Illuminate\Database\Seeder;

class TechnicianSeeder extends Seeder
{
    public function run(): void
    {
        Technician::query()->updateOrCreate(
            ['email' => 'tech@mobilelube.co'],
            [
                'name' => 'Demo Technician',
                'password' => 'password',
                'phone' => '(361) 655-5323',
                'is_active' => true,
            ],
        );
    }
}
