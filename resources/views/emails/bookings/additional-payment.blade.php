@php
    $ctaUrl = $recipientRole === 'admin' ? $details['admin_url'] : $checkoutUrl;
    $ctaLabel = $recipientRole === 'admin' ? 'Open booking in admin' : 'Pay remaining balance';

    [$eyebrow, $heading, $intro] = match ($recipientRole) {
        'admin' => [
            'Additional payment requested',
            '$' . $amountDue . ' still due from ' . $details['customer_name'],
            'A pricing adjustment increased this booking total. The customer was emailed a secure payment link for the difference.',
        ],
        default => [
            'Additional payment needed',
            'Please pay the remaining $' . $amountDue,
            'We updated the price on your Mobile Lube booking. Your original payment still applies — you only need to pay the difference explained below.',
        ],
    };
@endphp

<x-email.brand-layout :message="$message" :eyebrow="$eyebrow" :heading="$heading" :intro="$intro" :action-url="$ctaUrl"
    :action-label="$ctaLabel" title="Additional payment">
    @include('emails.partials.detail-panel', [
        'rows' => [
            'Why you need to pay again' => $reason,
            'Amount due now' => '$' . $amountDue,
            'Updated booking total' => '$' . $details['total_price'],
            'When' => $details['scheduled_at'],
            'Service' => $details['service_name'],
            'Vehicle' => $details['vehicle_name'],
            'Location' => $details['address'],
        ],
    ])
    @if ($recipientRole !== 'admin')
        <p style="margin:16px 0 0;font-size:14px;line-height:1.65;color:#64748b;">
            Use the button above for a secure Stripe checkout. You can also open your booking anytime and pay the
            remaining balance there.
        </p>
    @endif
</x-email.brand-layout>
