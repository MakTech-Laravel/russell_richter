<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
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
            ->map(fn(DatabaseNotification $notification) => $this->transform($notification))
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
            'url' => $data['url'] ?? route('admin.dashboard'),
            'read_at' => $notification->read_at?->toIso8601String(),
            'created_at' => $notification->created_at?->diffForHumans() ?? '',
        ];
    }
}
