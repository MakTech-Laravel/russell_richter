<?php

namespace App\Mail;

use App\Enums\BookingStatus;
use App\Mail\Concerns\HasBookingMailDetails;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingStatusChangedMail extends Mailable implements ShouldQueue
{
    use HasBookingMailDetails, Queueable, SerializesModels;

    /**
     * @param  'customer'|'admin'|'technician'  $recipientRole
     */
    public function __construct(
        public Booking $booking,
        public BookingStatus $previousStatus,
        public string $recipientRole = 'customer',
    ) {}

    public function envelope(): Envelope
    {
        $details = $this->bookingDetails($this->booking);

        $subject = match ($this->booking->status) {
            BookingStatus::InProgress => match ($this->recipientRole) {
                'admin' => sprintf('Service started: %s', $details['customer_name']),
                default => 'Your Mobile Lube service is in progress',
            },
            BookingStatus::Completed => match ($this->recipientRole) {
                'admin' => sprintf('Service completed: %s', $details['customer_name']),
                'technician' => sprintf('Job completed: %s', $details['customer_name']),
                default => 'Your Mobile Lube service is complete — thank you!',
            },
            default => sprintf('Booking update: %s', $details['status_label']),
        };

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.bookings.status-changed',
            with: [
                'details' => $this->bookingDetails($this->booking),
                'recipientRole' => $this->recipientRole,
                'previousStatusLabel' => $this->previousStatus->label(),
                'status' => $this->booking->status,
            ],
        );
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
