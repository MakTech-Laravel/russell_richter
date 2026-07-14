@php
    $ctaUrl = $recipientRole === 'admin' ? $details['admin_url'] : $details['customer_url'];
    $ctaLabel = $recipientRole === 'admin' ? 'Open booking in admin' : 'View my appointment';
@endphp

@if ($recipientRole === 'admin')
    <x-email.brand-layout :message="$message" eyebrow="New paid booking" :heading="$details['customer_name'] . ' booked for ' . $details['scheduled_friendly']"
        intro="Payment received. This Mobile Lube appointment is confirmed and ready for technician assignment."
        :action-url="$ctaUrl" :action-label="$ctaLabel" title="Paid booking">
        @include('emails.partials.detail-panel', [
            'rows' => [
                'When' => $details['scheduled_at'],
                'Customer' => $details['customer_name'],
                'Email' => $details['customer_email'],
                'Phone' => $details['customer_phone'],
                'Service' => $details['service_name'],
                'Vehicle' => $details['vehicle_name'],
                'Location' => $details['address'],
                'Total paid' => '$' . $details['total_price'],
                'Notes' => $details['customer_notes'],
            ],
        ])
    </x-email.brand-layout>
@else
    <x-email.brand-layout :message="$message" eyebrow="Appointment confirmed" :heading="'You\'re all set for ' . $details['scheduled_friendly']"
        intro="Payment received — your Mobile Lube visit is confirmed. A certified technician will come to you with everything needed for a spill-free service."
        :action-url="$ctaUrl" :action-label="$ctaLabel" title="Booking confirmed">
        @include('emails.partials.detail-panel', [
            'rows' => [
                'When' => $details['scheduled_at'],
                'Service' => $details['service_name'],
                'Vehicle' => $details['vehicle_name'],
                'Service location' => $details['address'],
                'Amount paid' => '$' . $details['total_price'],
                'Status' => $details['status_label'],
            ],
        ])
        <p style="margin:16px 0 0;font-size:14px;line-height:1.65;color:#64748b;">
            We’ll email you again when your technician is assigned. Questions? Call
            {{ \App\Support\MobileLubeBrand::phone() }}.
        </p>
    </x-email.brand-layout>
@endif
