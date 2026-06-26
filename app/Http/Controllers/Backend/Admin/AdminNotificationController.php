<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class AdminNotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var Admin $admin */
        $admin = $request->user('admin');

        if ($request->boolean('count_only')) {
            return response()->json([
                'unread_count' => $admin->unreadNotifications()->count(),
            ]);
        }

        $notifications = $admin->notifications()
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn (DatabaseNotification $notification) => $this->transform($notification))
            ->values();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $admin->unreadNotifications()->count(),
        ]);
    }

    public function markAsRead(Request $request, string $notification): JsonResponse
    {
        /** @var Admin $admin */
        $admin = $request->user('admin');

        $admin->notifications()
            ->whereKey($notification)
            ->firstOrFail()
            ->markAsRead();

        return response()->json([
            'unread_count' => $admin->unreadNotifications()->count(),
        ]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        /** @var Admin $admin */
        $admin = $request->user('admin');

        $admin->unreadNotifications->markAsRead();

        return response()->json([
            'unread_count' => 0,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transform(DatabaseNotification $notification): array
    {
        /** @var array<string, mixed> $data */
        $data = $notification->data;

        return [
            'id' => $notification->id,
            'type' => $data['type'] ?? 'general',
            'title' => $data['title'] ?? 'Notification',
            'message' => $data['message'] ?? '',
            'url' => $this->toRelativePath($data['url'] ?? route('admin.dashboard', [], false)),
            'read_at' => $notification->read_at?->toIso8601String(),
            'created_at' => $notification->created_at?->diffForHumans() ?? '',
        ];
    }

    private function toRelativePath(string $url): string
    {
        $path = str_starts_with($url, '/') ? $url : (parse_url($url, PHP_URL_PATH) ?? '/');
        $query = parse_url($url, PHP_URL_QUERY);
        $fragment = parse_url($url, PHP_URL_FRAGMENT);
        $relative = $path.($query ? '?'.$query : '').($fragment ? '#'.$fragment : '');

        // Auto-upgrade legacy booking URLs that still use plain integer IDs.
        if (preg_match('#^/admin/bookings/(\d+)$#', $relative, $matches)) {
            return route('admin.bookings.show', ['booking' => Booking::encryptRouteKey((int) $matches[1])], false);
        }

        return $relative;
    }
}
