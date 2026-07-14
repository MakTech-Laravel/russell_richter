<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactMessageRequest;
use App\Models\ContactMessage;
use App\Services\BookingMailNotifier;
use Illuminate\Http\RedirectResponse;

class ContactMessageController extends Controller
{
    public function __construct(private BookingMailNotifier $bookingMailNotifier) {}

    public function store(StoreContactMessageRequest $request): RedirectResponse
    {
        $contactMessage = ContactMessage::query()->create($request->validated());

        $this->bookingMailNotifier->contactMessageReceived($contactMessage);

        return back()->with('success', 'Thanks. We received your inquiry and will get back to you soon.');
    }
}
