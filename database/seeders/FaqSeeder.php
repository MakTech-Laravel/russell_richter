<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'What is Mobile Lube?',
                'answer' => 'Mobile Lube is a convenient on-site service that brings professional oil changes and vehicle maintenance directly to your home, workplace, or job site in Victoria County, Texas.',
                'sort_order' => 1,
            ],
            [
                'question' => 'What types of vehicles do you service?',
                'answer' => 'We service most cars, trucks, SUVs, and light-duty diesel pickups. Contact us for specialty or fleet vehicles.',
                'sort_order' => 2,
            ],
            [
                'question' => 'How long does an oil change take?',
                'answer' => 'A typical oil change takes about 30 minutes, depending on the vehicle and additional services requested.',
                'sort_order' => 3,
            ],
            [
                'question' => 'What area do you serve?',
                'answer' => 'We proudly serve all of Victoria County, Texas — home, office, or job site.',
                'sort_order' => 4,
            ],
            [
                'question' => 'What are your hours?',
                'answer' => 'Monday through Friday, 8 AM to 6 PM. Contact us to schedule your appointment.',
                'sort_order' => 5,
            ],
            [
                'question' => 'Do you offer fleet services?',
                'answer' => 'Yes! We offer customized fleet maintenance plans for businesses. Submit a fleet inquiry and we will contact you with pricing.',
                'sort_order' => 6,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::query()->firstOrCreate(
                ['question' => $faq['question']],
                array_merge($faq, ['is_active' => true]),
            );
        }
    }
}
