@php
    use App\Enums\BookingStatus;

    $ctaUrl = match ($recipientRole) {
        'admin' => $details['admin_url'],
        'technician' => $details['technician_url'] ?? $details['admin_url'],
        default => $details['customer_url'],
    };

    $isInProgress = $status === BookingStatus::InProgress;
    $isCompleted = $status === BookingStatus::Completed;

    if ($isInProgress) {
        [$eyebrow, $heading, $intro] = match ($recipientRole) {
            'admin' => [
                'Service in progress',
                'Work started for ' . $details['customer_name'],
                'The technician has started this Mobile Lube visit.',
            ],
            default => [
                'Service in progress',
                'Your Mobile Lube tech is working now',
                'Your spill-free mobile service is underway at your location.',
            ],
        };
    } elseif ($isCompleted) {
        [$eyebrow, $heading, $intro] = match ($recipientRole) {
            'admin' => [
                'Service completed',
                $details['customer_name'] . ' — job complete',
                'This Mobile Lube appointment has been marked complete.',
            ],
            'technician' => [
                'Job completed',
                'Completion recorded',
                'Your completion for ' . $details['customer_name'] . ' is saved in history.',
            ],
            default => [
                'Service complete',
                'Thanks for choosing Mobile Lube',
                'Your mobile oil change / service is complete. Drive safe — we look forward to seeing you next time.',
            ],
        };
    } else {
        $eyebrow = 'Booking update';
        $heading = 'Status changed to ' . $details['status_label'];
        $intro = 'Previous status: ' . $previousStatusLabel . '.';
    }
@endphp

<x-email.brand-layout :message="$message" :eyebrow="$eyebrow" :heading="$heading" :intro="$intro" :action-url="$ctaUrl" action-label="View details"
    title="Booking status update">
    @include('emails.partials.detail-panel', [
        'rows' => [
            'When' => $details['scheduled_at'],
            'Service' => $details['service_name'],
            'Vehicle' => $details['vehicle_name'],
            'Location' => $details['address'],
            'Status' => $details['status_label'],
            'Technician' => $details['technician_name'],
        ],
    ])
</x-email.brand-layout>
