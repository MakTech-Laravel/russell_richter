@props([
    'message',
    'heading',
    'intro' => null,
    'eyebrow' => null,
    'actionUrl' => null,
    'actionLabel' => 'View details',
    'title' => null,
])

@php
    $logoSrc = $message->embed(\App\Support\MobileLubeBrand::logoPath());
@endphp

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>{{ $title ?? \App\Support\MobileLubeBrand::legalName() }}</title>
</head>

<body
    style="margin:0;padding:0;background:#e8eef5;font-family:Segoe UI,Helvetica Neue,Arial,sans-serif;color:#0f182e;-webkit-font-smoothing:antialiased;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
        style="background:#e8eef5;padding:32px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                    style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(15,24,46,0.08);">
                    <tr>
                        <td style="background:#0f182e;padding:28px 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td>
                                        <img src="{{ $logoSrc }}"
                                            alt="{{ \App\Support\MobileLubeBrand::legalName() }}" width="160"
                                            style="display:block;max-width:160px;height:auto;border:0;">
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top:14px;">
                                        <p
                                            style="margin:0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#5eead4;font-weight:600;">
                                            {{ \App\Support\MobileLubeBrand::tagline() }}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:36px 32px 28px;">
                            @if ($eyebrow)
                                <p
                                    style="margin:0 0 10px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#0D9488;font-weight:700;">
                                    {{ $eyebrow }}
                                </p>
                            @endif

                            <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;font-weight:700;color:#0f182e;">
                                {{ $heading }}
                            </h1>

                            @if ($intro)
                                <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#334155;">
                                    {{ $intro }}
                                </p>
                            @endif

                            {{ $slot }}

                            @if ($actionUrl)
                                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;">
                                    <tr>
                                        <td style="border-radius:10px;background:#0D9488;">
                                            <a href="{{ $actionUrl }}"
                                                style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.02em;">
                                                {{ $actionLabel }}
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            @endif
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:0 32px 28px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                                style="background:#f4f7fb;border-radius:12px;">
                                <tr>
                                    <td style="padding:18px 20px;">
                                        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0f182e;">Need
                                            help with your service?</p>
                                        <p style="margin:0;font-size:13px;line-height:1.6;color:#475569;">
                                            Call <a href="{{ \App\Support\MobileLubeBrand::phoneHref() }}"
                                                style="color:#0D9488;text-decoration:none;font-weight:600;">{{ \App\Support\MobileLubeBrand::phone() }}</a>
                                            · {{ \App\Support\MobileLubeBrand::hours() }}<br>
                                            Serving {{ \App\Support\MobileLubeBrand::serviceArea() }}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:#0f182e;padding:22px 32px;text-align:center;">
                            <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#ffffff;">
                                {{ \App\Support\MobileLubeBrand::legalName() }}
                            </p>
                            <p style="margin:0;font-size:12px;line-height:1.55;color:#94a3b8;">
                                Professional mobile oil changes &amp; essential maintenance.<br>
                                We come to you across {{ \App\Support\MobileLubeBrand::serviceArea() }}.<br>
                                <a href="{{ \App\Support\MobileLubeBrand::websiteUrl() }}"
                                    style="color:#5eead4;text-decoration:none;">Visit our website</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
