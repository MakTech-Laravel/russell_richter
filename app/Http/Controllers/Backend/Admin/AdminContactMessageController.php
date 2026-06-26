<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminContactMessageController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $contactMessages = ContactMessage::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($builder) use ($search) {
                    $builder->where('company_name', 'like', "%{$search}%")
                        ->orWhere('contact_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('vehicle_types', 'like', "%{$search}%")
                        ->orWhere('message', 'like', "%{$search}%");
                });
            })
            ->when($status === 'unread', fn ($query) => $query->unread())
            ->when($status === 'read', fn ($query) => $query->whereNotNull('read_at'))
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (ContactMessage $message) => [
                'id' => $message->id,
                'route_key' => $message->getRouteKey(),
                'company_name' => $message->company_name,
                'contact_name' => $message->contact_name,
                'email' => $message->email,
                'phone' => $message->phone,
                'vehicle_count' => $message->vehicle_count,
                'vehicle_types' => $message->vehicle_types,
                'message' => $message->message,
                'message_excerpt' => Str::limit($message->message, 90),
                'is_unread' => $message->isUnread(),
                'read_at' => $message->read_at?->toDateTimeString(),
                'created_at' => $message->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('backend/Admin/Contacts/Index', [
            'contactMessages' => $contactMessages,
            'filters' => [
                'search' => $search,
                'status' => $status !== '' ? $status : 'all',
            ],
        ]);
    }

    public function show(ContactMessage $contactMessage): Response
    {
        $contactMessage->markAsRead();

        return Inertia::render('backend/Admin/Contacts/Show', [
            'contactMessage' => [
                'id' => $contactMessage->id,
                'route_key' => $contactMessage->getRouteKey(),
                'company_name' => $contactMessage->company_name,
                'contact_name' => $contactMessage->contact_name,
                'email' => $contactMessage->email,
                'phone' => $contactMessage->phone,
                'vehicle_count' => $contactMessage->vehicle_count,
                'vehicle_types' => $contactMessage->vehicle_types,
                'message' => $contactMessage->message,
                'is_unread' => $contactMessage->isUnread(),
                'read_at' => $contactMessage->read_at?->toDateTimeString(),
                'created_at' => $contactMessage->created_at?->toDateTimeString(),
            ],
        ]);
    }
}
