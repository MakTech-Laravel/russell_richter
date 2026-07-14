<?php

use App\Mail\PasswordChangedMail;
use App\Mail\WelcomeMail;
use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

test('welcome email is queued when a user registers', function () {
    Mail::fake();

    $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'welcome@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertRedirect(route('dashboard', absolute: false));

    Mail::assertQueued(WelcomeMail::class, function (WelcomeMail $mail): bool {
        return $mail->hasTo('welcome@example.com')
            && $mail->user->name === 'Test User';
    });
});

test('password changed email is queued after a successful password reset', function () {
    Notification::fake();
    Mail::fake();

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPasswordNotification::class, function ($notification) use ($user): bool {
        $this->post(route('password.update'), [
            'token' => $notification->token,
            'email' => $user->email,
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ])->assertRedirect(route('login'));

        return true;
    });

    Mail::assertQueued(PasswordChangedMail::class, fn (PasswordChangedMail $mail) => $mail->hasTo($user->email));
});

test('password changed email is queued when updating password in settings', function () {
    Mail::fake();

    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('user-password.edit'))
        ->put(route('user-password.update'), [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertRedirect(route('user-password.edit'));

    Mail::assertQueued(PasswordChangedMail::class, fn (PasswordChangedMail $mail) => $mail->hasTo($user->email));
});
