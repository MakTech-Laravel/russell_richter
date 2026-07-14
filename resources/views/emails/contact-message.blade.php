<x-email.brand-layout :message="$message"
    eyebrow="Website inquiry"
    :heading="'New message from '.$contact->contact_name"
    intro="Someone reached out through the Mobile Lube website. Reply from admin or email them directly."
    :action-url="$adminUrl"
    action-label="Open in admin"
    title="New contact inquiry"
>
    @include('emails.partials.detail-panel', [
        'rows' => [
            'Company' => $contact->company_name,
            'Contact' => $contact->contact_name,
            'Email' => $contact->email,
            'Phone' => $contact->phone,
            'Vehicles' => $contact->vehicle_count,
            'Vehicle types' => $contact->vehicle_types,
            'Message' => $contact->message,
        ],
    ])
</x-email.brand-layout>
