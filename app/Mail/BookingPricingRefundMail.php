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

class BookingPricingRefundMail extends Mailable implements ShouldQueue
{
    use HasBookingMailDetails, Queueable, SerializesModels;

    public function __construct(
        public Booking $booking,
        public float $refundAmount,
        public string $reason,
        public string $recipientRole = 'customer',
    ) {}

    public function envelope(): Envelope
    {
        $details = $this->bookingDetails($this->booking);

        $subject = $this->recipientRole === 'admin'
            ? sprintf(
                'Cashback refund issued: %s — $%s',
                $details['customer_name'],
                number_format($this->refundAmount, 2),
            )
            : sprintf(
                'Cashback refund of $%s is on the way',
                number_format($this->refundAmount, 2),
            );

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.bookings.pricing-refund',
            with: [
                'details' => $this->bookingDetails($this->booking),
                'recipientRole' => $this->recipientRole,
                'refundAmount' => number_format($this->refundAmount, 2),
                'reason' => $this->reason,
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
