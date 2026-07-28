<?php

namespace App\Notifications;

use App\Mail\PasswordResetMail;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends ResetPassword implements ShouldQueue
{
    use Queueable;

    /**
     * Hostinger SMTP occasionally returns 421 timeouts; retry with backoff.
     */
    public int $tries = 5;

    /**
     * @var list<int>
     */
    public array $backoff = [15, 30, 60, 120];

    /**
     * @param  mixed  $notifiable
     */
    public function toMail($notifiable): PasswordResetMail|MailMessage
    {
        $url = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        return (new PasswordResetMail($notifiable, $url))
            ->to($notifiable->getEmailForPasswordReset());
    }
}
