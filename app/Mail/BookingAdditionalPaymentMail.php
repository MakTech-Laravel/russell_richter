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

class BookingAdditionalPaymentMail extends Mailable implements ShouldQueue
{
    use HasBookingMailDetails, Queueable, SerializesModels;

    public function __construct(
        public Booking $booking,
        public float $amountDue,
        public string $reason,
        public ?string $checkoutUrl = null,
        public string $recipientRole = 'customer',
    ) {}

    public function envelope(): Envelope
    {
        $details = $this->bookingDetails($this->booking);

        $subject = $this->recipientRole === 'admin'
            ? sprintf(
                'Additional payment requested: %s — $%s',
                $details['customer_name'],
                number_format($this->amountDue, 2),
            )
            : sprintf(
                'Additional payment of $%s needed for your Mobile Lube visit',
                number_format($this->amountDue, 2),
            );

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.bookings.additional-payment',
            with: [
                'details' => $this->bookingDetails($this->booking),
                'recipientRole' => $this->recipientRole,
                'amountDue' => number_format($this->amountDue, 2),
                'reason' => $this->reason,
                'checkoutUrl' => $this->checkoutUrl ?: $this->bookingDetails($this->booking)['customer_url'],
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
