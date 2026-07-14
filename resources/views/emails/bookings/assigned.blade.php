@php
    $ctaUrl = match ($recipientRole) {
        'admin' => $details['admin_url'],
        'technician' => $details['technician_url'] ?? $details['admin_url'],
        default => $details['customer_url'],
    };
    $ctaLabel = $recipientRole === 'technician' ? 'Open job details' : 'View appointment';

    [$eyebrow, $heading, $intro] = match ($recipientRole) {
        'technician' => [
            'New job assigned',
            'You are assigned to ' . $details['customer_name'],
            'Mobile Lube job for ' .
            $details['scheduled_friendly'] .
            '. Arrive spill-free ready with recommended fluids and filter.',
        ],
        'admin' => [
            'Technician assigned',
            ($details['technician_name'] ?? 'Technician') . ' → ' . $details['customer_name'],
            'A technician has been assigned to this paid Mobile Lube booking.',
        ],
        default => [
            'Technician confirmed',
            $details['technician_name'] ? $details['technician_name'] . ' is assigned' : 'Your technician is assigned',
            'Your Mobile Lube tech is confirmed for ' .
            $details['scheduled_friendly'] .
            '. They will come to you — no waiting room needed.',
        ],
    };
@endphp

<x-email.brand-layout :message="$message" :eyebrow="$eyebrow" :heading="$heading" :intro="$intro" :action-url="$ctaUrl" :action-label="$ctaLabel"
    title="Technician assigned">
    @include('emails.partials.detail-panel', [
        'rows' => [
            'When' => $details['scheduled_at'],
            'Service' => $details['service_name'],
            'Vehicle' => $details['vehicle_name'],
            'Location' => $details['address'],
            'Technician' => $details['technician_name'],
            'Customer phone' => $recipientRole === 'technician' ? $details['customer_phone'] : null,
            'Notes' => $details['customer_notes'],
        ],
    ])
</x-email.brand-layout>
