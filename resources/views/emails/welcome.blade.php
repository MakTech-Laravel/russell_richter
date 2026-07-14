<x-email.brand-layout :message="$message" eyebrow="Welcome aboard" :heading="'Hi ' . $userName . ', welcome to Mobile Lube'"
    intro="Thanks for creating your account. Book a mobile oil change in minutes — our certified tech comes to your home, office, or jobsite across Victoria County, Texas."
    :action-url="$dashboardUrl" action-label="Open my dashboard" title="Welcome to Mobile Lube">
    <p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#334155;">
        Here’s what you can do next:
    </p>
    <ul style="margin:0;padding-left:18px;color:#334155;font-size:14px;line-height:1.7;">
        <li>Add your vehicle details</li>
        <li>Choose a service package</li>
        <li>Pick a time — we come to you</li>
    </ul>
</x-email.brand-layout>
