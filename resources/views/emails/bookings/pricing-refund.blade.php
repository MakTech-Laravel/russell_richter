@php
    $ctaUrl = $recipientRole === 'admin' ? $details['admin_url'] : $details['customer_url'];
    $ctaLabel = $recipientRole === 'admin' ? 'Open booking in admin' : 'View my appointment';

    [$eyebrow, $heading, $intro] = match ($recipientRole) {
        'admin' => [
            'Cashback refund issued',
            '$' . $refundAmount . ' refunded to ' . $details['customer_name'],
            'A pricing adjustment reduced this booking total. The difference was refunded to the original payment method.',
        ],
        default => [
            'Cashback refund',
            'A $' . $refundAmount . ' refund is on the way',
            'We adjusted the price on your Mobile Lube booking. The difference is being returned to the card you originally paid with (cashback/refund).',
        ],
    };
@endphp

<x-email.brand-layout :message="$message" :eyebrow="$eyebrow" :heading="$heading" :intro="$intro" :action-url="$ctaUrl"
    :action-label="$ctaLabel" title="Cashback refund">
    @include('emails.partials.detail-panel', [
        'rows' => [
            'Reason' => $reason,
            'Refund amount' => '$' . $refundAmount,
            'New booking total' => '$' . $details['total_price'],
            'When' => $details['scheduled_at'],
            'Service' => $details['service_name'],
            'Vehicle' => $details['vehicle_name'],
        ],
    ])
    @if ($recipientRole !== 'admin')
        <p style="margin:16px 0 0;font-size:14px;line-height:1.65;color:#64748b;">
            Bank and card refunds usually appear within a few business days, depending on your bank.
        </p>
    @endif
</x-email.brand-layout>
