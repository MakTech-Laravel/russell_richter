@php
    $ctaUrl = match ($recipientRole) {
        'admin' => $details['admin_url'],
        'technician' => $details['technician_url'] ?? $details['admin_url'],
        default => $details['customer_url'],
    };

    [$eyebrow, $heading, $intro] = match ($recipientRole) {
        'admin' => [
            'Booking cancelled',
            $details['customer_name'] . ' — ' . $details['scheduled_friendly'] . ' cancelled',
            'This paid Mobile Lube appointment has been cancelled.',
        ],
        'technician' => [
            'Job cancelled',
            'Your assigned job was cancelled',
            $details['customer_name'] .
            '’s appointment on ' .
            $details['scheduled_friendly'] .
            ' is no longer on your route.',
        ],
        default => [
            'Appointment cancelled',
            'Your Mobile Lube visit was cancelled',
            'Your appointment for ' .
            $details['scheduled_friendly'] .
            ' has been cancelled. You can book again anytime from your dashboard.',
        ],
    };
@endphp

<x-email.brand-layout :message="$message" :eyebrow="$eyebrow" :heading="$heading" :intro="$intro" :action-url="$ctaUrl" action-label="View details"
    title="Booking cancelled">
    @include('emails.partials.detail-panel', [
        'rows' => [
            'When' => $details['scheduled_at'],
            'Service' => $details['service_name'],
            'Vehicle' => $details['vehicle_name'],
            'Location' => $details['address'],
        ],
    ])
</x-email.brand-layout>
