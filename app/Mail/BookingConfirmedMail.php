<?php

namespace App\Mail;

use App\Mail\Concerns\HasBookingMailDetails;
use App\Models\Booking;
use App\Support\MobileLubeBrand;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingConfirmedMail extends Mailable implements ShouldQueue
{
    use HasBookingMailDetails, Queueable, SerializesModels;

    /**
     * @param  'customer'|'admin'  $recipientRole
     */
    public function __construct(
        public Booking $booking,
        public string $recipientRole = 'customer',
    ) {}

    public function envelope(): Envelope
    {
        $details = $this->bookingDetails($this->booking);

        $subject = $this->recipientRole === 'admin'
            ? sprintf(
                'Paid booking: %s booked for %s',
                $details['customer_name'],
                $details['scheduled_friendly'],
            )
            : sprintf(
                'You\'re confirmed — Mobile Lube on %s',
                $details['scheduled_friendly'],
            );

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.bookings.confirmed',
            with: [
                'details' => $this->bookingDetails($this->booking),
                'recipientRole' => $this->recipientRole,
                'brandName' => MobileLubeBrand::name(),
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
