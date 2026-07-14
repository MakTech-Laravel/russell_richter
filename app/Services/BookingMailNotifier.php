<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Mail\BookingAssignedMail;
use App\Mail\BookingCancelledMail;
use App\Mail\BookingConfirmedMail;
use App\Mail\BookingStatusChangedMail;
use App\Mail\BookingUpdatedMail;
use App\Mail\ContactMessageMail;
use App\Mail\PasswordChangedMail;
use App\Mail\WelcomeMail;
use App\Models\Booking;
use App\Models\ContactMessage;
use App\Models\Technician;
use App\Models\User;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;

class BookingMailNotifier
{
    public function welcome(User $user): void
    {
        Mail::to($user)->send(new WelcomeMail($user));
    }

    public function passwordChanged(User $user): void
    {
        Mail::to($user)->send(new PasswordChangedMail($user));
    }

    /**
     * Send paid-booking alerts to customer and admins.
     * Booking emails only go out after successful payment.
     */
    public function bookingConfirmed(Booking $booking): void
    {
        $booking->loadMissing(['user', 'service', 'vehicle', 'technician']);

        if (! $booking->isPaid()) {
            return;
        }

        $customerEmail = $booking->user?->email;

        if ($customerEmail) {
            Mail::to($booking->user)->send(new BookingConfirmedMail($booking, 'customer'));
        }

        $this->eachAdmin(
            fn(): Mailable => new BookingConfirmedMail($booking, 'admin'),
            exceptEmail: $customerEmail,
        );
    }

    public function bookingCancelled(Booking $booking): void
    {
        $booking->loadMissing(['user', 'service', 'vehicle', 'technician']);

        if (! $booking->isPaid()) {
            return;
        }

        $customerEmail = $booking->user?->email;

        if ($customerEmail) {
            Mail::to($booking->user)->send(new BookingCancelledMail($booking, 'customer'));
        }

        $this->eachAdmin(
            fn(): Mailable => new BookingCancelledMail($booking, 'admin'),
            exceptEmail: $customerEmail,
        );

        $this->sendToAssignedTechnician(
            $booking,
            new BookingCancelledMail($booking, 'technician'),
            exceptEmail: $customerEmail,
        );
    }

    public function bookingUpdated(Booking $booking): void
    {
        $booking->loadMissing(['user', 'service', 'vehicle', 'technician']);

        if (! $booking->isPaid()) {
            return;
        }

        $customerEmail = $booking->user?->email;

        if ($customerEmail) {
            Mail::to($booking->user)->send(new BookingUpdatedMail($booking, 'customer'));
        }

        $this->eachAdmin(
            fn(): Mailable => new BookingUpdatedMail($booking, 'admin'),
            exceptEmail: $customerEmail,
        );

        $this->sendToAssignedTechnician(
            $booking,
            new BookingUpdatedMail($booking, 'technician'),
            exceptEmail: $customerEmail,
        );
    }

    public function technicianAssigned(Booking $booking, ?int $previousTechnicianId = null): void
    {
        $booking->loadMissing(['user', 'service', 'vehicle', 'technician']);

        if (! $booking->isPaid() || ! $booking->technician_id) {
            return;
        }

        $customerEmail = $booking->user?->email;

        if ($customerEmail) {
            Mail::to($booking->user)->send(new BookingAssignedMail($booking, 'customer'));
        }

        $this->eachAdmin(
            fn(): Mailable => new BookingAssignedMail($booking, 'admin'),
            exceptEmail: $customerEmail,
        );

        if (
            $booking->technician?->email
            && ! $this->sameEmail($booking->technician->email, $customerEmail)
        ) {
            Mail::to($booking->technician)->send(new BookingAssignedMail($booking, 'technician'));
        }

        if (
            $previousTechnicianId
            && $previousTechnicianId !== $booking->technician_id
        ) {
            $previousTechnician = Technician::query()->find($previousTechnicianId);

            if (
                $previousTechnician?->email
                && ! $this->sameEmail($previousTechnician->email, $customerEmail)
            ) {
                Mail::to($previousTechnician)->send(new BookingUpdatedMail($booking, 'technician'));
            }
        }
    }

    public function statusChanged(Booking $booking, BookingStatus $previousStatus): void
    {
        if ($booking->status === $previousStatus) {
            return;
        }

        $booking->loadMissing(['user', 'service', 'vehicle', 'technician']);

        if (! $booking->isPaid()) {
            return;
        }

        if ($booking->status === BookingStatus::Cancelled) {
            $this->bookingCancelled($booking);

            return;
        }

        if (! in_array($booking->status, [BookingStatus::InProgress, BookingStatus::Completed], true)) {
            return;
        }

        $customerEmail = $booking->user?->email;

        if ($customerEmail) {
            Mail::to($booking->user)->send(
                new BookingStatusChangedMail($booking, $previousStatus, 'customer'),
            );
        }

        $this->eachAdmin(
            fn(): Mailable => new BookingStatusChangedMail($booking, $previousStatus, 'admin'),
            exceptEmail: $customerEmail,
        );

        if ($booking->status === BookingStatus::Completed) {
            $this->sendToAssignedTechnician(
                $booking,
                new BookingStatusChangedMail($booking, $previousStatus, 'technician'),
                exceptEmail: $customerEmail,
            );
        }
    }

    public function contactMessageReceived(ContactMessage $contactMessage): void
    {
        $this->eachAdmin(
            fn(): Mailable => new ContactMessageMail($contactMessage),
        );
    }

    /**
     * @param  callable(): Mailable  $mailableFactory
     */
    private function eachAdmin(callable $mailableFactory, ?string $exceptEmail = null): void
    {
        $adminAddress = config('mail.admin_address');

        if (! is_string($adminAddress) || trim($adminAddress) === '') {
            return;
        }

        if ($this->sameEmail($adminAddress, $exceptEmail)) {
            return;
        }

        Mail::to($adminAddress)->send($mailableFactory());
    }

    private function sendToAssignedTechnician(Booking $booking, Mailable $mailable, ?string $exceptEmail = null): void
    {
        if (
            $booking->technician?->email
            && ! $this->sameEmail($booking->technician->email, $exceptEmail)
        ) {
            Mail::to($booking->technician)->send($mailable);
        }
    }

    private function sameEmail(?string $left, ?string $right): bool
    {
        if ($left === null || $right === null) {
            return false;
        }

        return strcasecmp(trim($left), trim($right)) === 0;
    }
}
