<?php

namespace App\Mail;

use App\Mail\Concerns\HasBookingMailDetails;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingCancelledMail extends Mailable implements ShouldQueue
{
    use HasBookingMailDetails, Queueable, SerializesModels;

    /**
     * @param  'customer'|'admin'|'technician'  $recipientRole
     */
    public function __construct(
        public Booking $booking,
        public string $recipientRole = 'customer',
    ) {}

    public function envelope(): Envelope
    {
        $details = $this->bookingDetails($this->booking);

        $subject = match ($this->recipientRole) {
            'admin' => sprintf(
                'Booking cancelled: %s — %s',
                $details['customer_name'],
                $details['scheduled_friendly'],
            ),
            'technician' => sprintf(
                'Job cancelled: %s on %s',
                $details['customer_name'],
                $details['scheduled_friendly'],
            ),
            default => sprintf(
                'Your Mobile Lube appointment on %s was cancelled',
                $details['scheduled_friendly'],
            ),
        };

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.bookings.cancelled',
            with: [
                'details' => $this->bookingDetails($this->booking),
                'recipientRole' => $this->recipientRole,
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
