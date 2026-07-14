@php
    $ctaUrl = match ($recipientRole) {
        'admin' => $details['admin_url'],
        'technician' => $details['technician_url'] ?? $details['admin_url'],
        default => $details['customer_url'],
    };

    [$eyebrow, $heading, $intro] = match ($recipientRole) {
        'admin' => [
            'Booking updated',
            $details['customer_name'] . ' rescheduled to ' . $details['scheduled_friendly'],
            'Updated details for this Mobile Lube appointment are below.',
        ],
        'technician' => [
            'Job details updated',
            'Schedule or location changed',
            'Updated details for ' . $details['customer_name'] . ' are below.',
        ],
        default => [
            'Appointment updated',
            'Your Mobile Lube visit is now ' . $details['scheduled_friendly'],
            'We have saved your changes. A technician will still come to you at the location below.',
        ],
    };
@endphp

<x-email.brand-layout :message="$message" :eyebrow="$eyebrow" :heading="$heading" :intro="$intro" :action-url="$ctaUrl"
    action-label="View updated details" title="Booking updated">
    @include('emails.partials.detail-panel', [
        'rows' => [
            'When' => $details['scheduled_at'],
            'Service' => $details['service_name'],
            'Vehicle' => $details['vehicle_name'],
            'Location' => $details['address'],
            'Status' => $details['status_label'],
        ],
    ])
</x-email.brand-layout>
