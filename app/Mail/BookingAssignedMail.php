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

class BookingAssignedMail extends Mailable implements ShouldQueue
{
    use HasBookingMailDetails, Queueable, SerializesModels;

    /**
     * @param  'customer'|'technician'|'admin'  $recipientRole
     */
    public function __construct(
        public Booking $booking,
        public string $recipientRole = 'customer',
    ) {}

    public function envelope(): Envelope
    {
        $details = $this->bookingDetails($this->booking);

        $subject = match ($this->recipientRole) {
            'technician' => sprintf(
                'New Mobile Lube job: %s at %s',
                $details['customer_name'],
                $details['scheduled_friendly'],
            ),
            'admin' => sprintf(
                'Technician assigned: %s → %s',
                $details['technician_name'] ?? 'Technician',
                $details['customer_name'],
            ),
            default => sprintf(
                'Your Mobile Lube tech is confirmed for %s',
                $details['scheduled_friendly'],
            ),
        };

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.bookings.assigned',
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
