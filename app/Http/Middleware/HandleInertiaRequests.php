<?php

namespace App\Http\Middleware;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Laravel\Fortify\Features;

class HandleInertiaRequests extends Middleware
{
    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user('web');
        $admin = $request->user('admin');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? array_merge(
                    $user->only([
                        'id',
                        'email',
                        'name',
                        'phone_number',
                        'employee_code',
                        'avatar',
                    ]),
                    [
                        'name' => $this->displayName($user),
                        'role' => $user->role?->value,
                        'role_label' => $user->role_label,
                        'can_manage_users' => $user->canManageUsers(),
                        'avatar_url' => $user->avatar_url,
                    ]
                ) : null,
                'admin' => $admin ? [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                ] : null,
                'technician' => ($technician = $request->user('technician')) ? [
                    'id' => $technician->id,
                    'name' => $technician->name,
                    'email' => $technician->email,
                ] : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'portal' => $this->portalMeta($request),
            'features' => [
                'canRegister' => Features::enabled(Features::registration()),
                'canResetPassword' => Features::enabled(Features::resetPasswords()),
                'canVerifyEmail' => Features::enabled(Features::emailVerification()),
                'canUseTwoFactorAuthentication' => Features::enabled(Features::twoFactorAuthentication()),
            ],
        ];
    }

    private function displayName($user): string
    {
        return ! empty($user->name) ? $user->name : $user->email;
    }

    /**
     * @return array{pending_bookings: int}|null
     */
    private function portalMeta(Request $request): ?array
    {
        $user = $request->user('web');

        if ($user) {
            return [
                'pending_bookings' => Booking::query()
                    ->where('user_id', $user->id)
                    ->where('status', BookingStatus::Pending)
                    ->count(),
            ];
        }

        if ($request->user('admin')) {
            return [
                'pending_bookings' => Booking::query()
                    ->where('status', BookingStatus::Pending)
                    ->count(),
            ];
        }

        return null;
    }
}
