<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Model;

trait HasEncryptedRouteKey
{
    public function getRouteKey(): mixed
    {
        return self::encryptRouteKey($this->getKey());
    }

    public function resolveRouteBinding($value, $field = null): ?Model
    {
        $id = self::decryptRouteKey($value);

        if ($id === null) {
            return null;
        }

        return $this->where($field ?? $this->getRouteKeyName(), $id)->first();
    }

    public static function encryptRouteKey(int|string $id): string
    {
        $payload = (string) $id.'|'.hash_hmac('sha256', (string) $id, (string) config('app.key'));

        return rtrim(strtr(base64_encode($payload), '+/=', '-_.'), '.');
    }

    public static function decryptRouteKey(string $value): ?int
    {
        $decoded = base64_decode(strtr($value, '-_.', '+/='), true);

        if ($decoded === false || ! str_contains($decoded, '|')) {
            return null;
        }

        [$id, $hash] = explode('|', $decoded, 2);

        if (! hash_equals(hash_hmac('sha256', $id, (string) config('app.key')), $hash)) {
            return null;
        }

        return (int) $id;
    }
}
