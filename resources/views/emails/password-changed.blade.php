<x-email.brand-layout :message="$message" eyebrow="Account security" :heading="'Hi ' . $userName . ', your password was changed'"
    intro="Your Mobile Lube account password was updated successfully. If this was you, no further action is needed."
    :action-url="$loginUrl" action-label="Sign in to Mobile Lube" title="Password updated">
    <p style="margin:0;font-size:14px;line-height:1.65;color:#64748b;">
        If you did not change your password, reset it right away and call us at
        <strong style="color:#0f182e;">{{ \App\Support\MobileLubeBrand::phone() }}</strong>.
    </p>
</x-email.brand-layout>
