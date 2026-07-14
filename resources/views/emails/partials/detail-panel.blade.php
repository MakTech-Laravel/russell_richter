<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
    style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin:0 0 8px;">
    @foreach ($rows as $label => $value)
        @continue(blank($value))
        <tr>
            <td
                style="width:36%;padding:12px 14px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#64748b;vertical-align:top;">
                {{ $label }}
            </td>
            <td
                style="padding:12px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;line-height:1.5;color:#0f182e;font-weight:600;vertical-align:top;">
                {{ $value }}
            </td>
        </tr>
    @endforeach
</table>
