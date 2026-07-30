<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class SmsNotifier
{
    public function isConfigured(): bool
    {
        return filled(config('services.twilio.sid'))
            && filled(config('services.twilio.token'))
            && filled(config('services.twilio.from'));
    }

    public function send(string $to, string $message): bool
    {
        if (! $this->isConfigured()) {
            Log::info('SMS skipped because Twilio is not configured.', ['to' => $to]);

            return false;
        }

        $to = $this->normalizePhone($to);

        if ($to === null) {
            Log::warning('SMS skipped because phone number is invalid.', ['to' => $to]);

            return false;
        }

        try {
            $response = Http::asForm()
                ->withBasicAuth(
                    (string) config('services.twilio.sid'),
                    (string) config('services.twilio.token'),
                )
                ->timeout(15)
                ->post($this->messagesUrl(), [
                    'To' => $to,
                    'From' => config('services.twilio.from'),
                    'Body' => $message,
                ]);

            if ($response->failed()) {
                Log::error('Twilio SMS failed.', [
                    'status' => $response->status(),
                    'body' => $response->json() ?? $response->body(),
                ]);

                return false;
            }

            return true;
        } catch (ConnectionException|Throwable $exception) {
            Log::error('Twilio SMS exception.', [
                'message' => $exception->getMessage(),
            ]);

            return false;
        }
    }

    public function sendToAdmin(string $message): bool
    {
        $adminPhone = config('services.twilio.admin_phone');

        if (! filled($adminPhone)) {
            Log::info('SMS skipped because SMS_ADMIN_PHONE is not set.');

            return false;
        }

        return $this->send((string) $adminPhone, $message);
    }

    private function messagesUrl(): string
    {
        return sprintf(
            'https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json',
            config('services.twilio.sid'),
        );
    }

    private function normalizePhone(string $phone): ?string
    {
        $digits = preg_replace('/\D+/', '', $phone) ?? '';

        if (strlen($digits) === 10) {
            return '+1'.$digits;
        }

        if (strlen($digits) === 11 && str_starts_with($digits, '1')) {
            return '+'.$digits;
        }

        if (str_starts_with($phone, '+') && strlen($digits) >= 10) {
            return '+'.$digits;
        }

        return null;
    }
}
