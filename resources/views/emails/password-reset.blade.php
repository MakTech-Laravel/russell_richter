<x-email.brand-layout :message="$message"
    eyebrow="Password reset"
    :heading="'Hi '.$userName.', reset your password'"
    intro="We received a request to reset the password for your Mobile Lube account. Use the button below — this link expires for your security."
    :action-url="$resetUrl"
    action-label="Reset my password"
    title="Reset password"
>
    <p style="margin:0;font-size:14px;line-height:1.65;color:#64748b;">
        If you did not request a reset, you can ignore this email. Your password will stay the same.
        Need help? Call {{ \App\Support\MobileLubeBrand::phone() }}.
    </p>
</x-email.brand-layout>
