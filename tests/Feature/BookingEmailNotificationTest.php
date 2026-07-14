<?php

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\TransactionStatus;
use App\Mail\BookingAssignedMail;
use App\Mail\BookingCancelledMail;
use App\Mail\BookingConfirmedMail;
use App\Mail\BookingStatusChangedMail;
use App\Mail\BookingUpdatedMail;
use App\Models\Admin;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Technician;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\BookingMailNotifier;
use App\Services\GeocodingService;
use App\Services\StripeCheckoutService;
use Illuminate\Support\Facades\Mail;
use Stripe\Checkout\Session;

use function Pest\Laravel\mock;

it('does not email anyone when an unpaid booking is created', function () {
    Mail::fake();

    Admin::factory()->create();
    $user = User::factory()->create();

    mock(GeocodingService::class)
        ->shouldReceive('geocodeAddress')
        ->andReturn([
            'latitude' => 28.8,
            'longitude' => -96.9,
        ]);

    mock(StripeCheckoutService::class)
        ->shouldReceive('createCheckoutSession')
        ->andReturn(Session::constructFrom([
            'id' => 'cs_test_booking_mail',
            'url' => 'https://checkout.stripe.com/test',
        ]));

    $vehicle = Vehicle::factory()->create(['user_id' => $user->id]);
    $service = Service::factory()->create(['service_type' => 'package', 'is_active' => true]);

    $this->actingAs($user)
        ->post(route('bookings.store'), [
            'vehicle_id' => $vehicle->id,
            'service_id' => $service->id,
            'scheduled_at' => nextBusinessDayAt(10)->format('Y-m-d H:i:s'),
            'service_address' => '123 Main St',
            'service_city' => 'Victoria',
            'service_state' => 'TX',
            'service_zip' => '77901',
            'mileage_at_service' => 45000,
        ])
        ->assertRedirect('https://checkout.stripe.com/test');

    Mail::assertNothingQueued();
    Mail::assertNothingSent();
});

it('queues paid booking confirmation emails for customer and admins', function () {
    Mail::fake();

    $admin = Admin::factory()->create();
    $booking = Booking::factory()->create(['status' => BookingStatus::Pending]);
    $session = Session::constructFrom([
        'id' => 'cs_test_confirm_mail',
        'payment_status' => 'paid',
        'payment_intent' => 'pi_test_mail',
        'metadata' => ['booking_id' => (string) $booking->id],
    ]);

    Transaction::query()->create([
        'booking_id' => $booking->id,
        'user_id' => $booking->user_id,
        'amount' => $booking->total_price,
        'currency' => 'usd',
        'status' => TransactionStatus::Pending,
        'stripe_checkout_session_id' => 'cs_test_confirm_mail',
    ]);

    app(StripeCheckoutService::class)->markBookingPaidFromSession($booking, $session);

    Mail::assertQueued(BookingConfirmedMail::class, fn (BookingConfirmedMail $mail) => $mail->hasTo($booking->user->email));
    Mail::assertQueued(BookingConfirmedMail::class, fn (BookingConfirmedMail $mail) => $mail->hasTo(config('mail.admin_address')));
});

it('does not email on cancel when the booking was never paid', function () {
    Mail::fake();

    Admin::factory()->create();
    $user = User::factory()->create();
    $booking = Booking::factory()->create([
        'user_id' => $user->id,
        'payment_status' => PaymentStatus::Unpaid,
        'status' => BookingStatus::Pending,
    ]);

    $this->actingAs($user)
        ->delete(route('bookings.destroy', $booking))
        ->assertRedirect(route('bookings.index'));

    Mail::assertNothingQueued();
});

it('emails customer, admin, and technician when a paid booking is cancelled', function () {
    Mail::fake();

    $admin = Admin::factory()->create();
    $technician = Technician::factory()->create();
    $user = User::factory()->create();
    $booking = Booking::factory()->paid()->create([
        'user_id' => $user->id,
        'technician_id' => $technician->id,
        'status' => BookingStatus::Assigned,
    ]);

    $this->actingAs($user)
        ->delete(route('bookings.destroy', $booking))
        ->assertRedirect(route('bookings.index'));

    Mail::assertQueued(BookingCancelledMail::class, fn (BookingCancelledMail $mail) => $mail->hasTo($user->email));
    Mail::assertQueued(BookingCancelledMail::class, fn (BookingCancelledMail $mail) => $mail->hasTo(config('mail.admin_address')));
    Mail::assertQueued(BookingCancelledMail::class, fn (BookingCancelledMail $mail) => $mail->hasTo($technician->email));
});

it('emails customer, admin, and technician when a paid booking is rescheduled', function () {
    Mail::fake();

    $admin = Admin::factory()->create();
    $technician = Technician::factory()->create();
    $user = User::factory()->create();
    $booking = Booking::factory()->paid()->create([
        'user_id' => $user->id,
        'technician_id' => $technician->id,
        'status' => BookingStatus::Confirmed,
        'scheduled_at' => nextBusinessDayAt(9),
    ]);

    mock(GeocodingService::class)
        ->shouldReceive('geocodeAddress')
        ->andReturn([
            'latitude' => 28.8,
            'longitude' => -96.9,
        ]);

    $this->actingAs($user)
        ->put(route('bookings.update', $booking), [
            'scheduled_at' => nextBusinessDayAt(14)->format('Y-m-d H:i:s'),
            'service_address' => $booking->service_address,
            'service_city' => $booking->service_city,
            'service_state' => $booking->service_state,
            'service_zip' => $booking->service_zip,
        ])
        ->assertRedirect();

    Mail::assertQueued(BookingUpdatedMail::class, fn (BookingUpdatedMail $mail) => $mail->hasTo($user->email));
    Mail::assertQueued(BookingUpdatedMail::class, fn (BookingUpdatedMail $mail) => $mail->hasTo(config('mail.admin_address')));
    Mail::assertQueued(BookingUpdatedMail::class, fn (BookingUpdatedMail $mail) => $mail->hasTo($technician->email));
});

it('emails customer, admin, and technician when a technician is assigned to a paid booking', function () {
    Mail::fake();

    $admin = Admin::factory()->create();
    $technician = Technician::factory()->create();
    $booking = Booking::factory()->paid()->create(['status' => BookingStatus::Confirmed]);

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.bookings.update', $booking), [
            'status' => BookingStatus::Assigned->value,
            'technician_id' => $technician->id,
        ])
        ->assertRedirect();

    Mail::assertQueued(BookingAssignedMail::class, fn (BookingAssignedMail $mail) => $mail->hasTo($booking->user->email));
    Mail::assertQueued(BookingAssignedMail::class, fn (BookingAssignedMail $mail) => $mail->hasTo(config('mail.admin_address')));
    Mail::assertQueued(BookingAssignedMail::class, fn (BookingAssignedMail $mail) => $mail->hasTo($technician->email));
});

it('emails customer and admin when a technician starts a paid job', function () {
    Mail::fake();

    $admin = Admin::factory()->create();
    $technician = Technician::factory()->create();
    $booking = Booking::factory()->paid()->create([
        'technician_id' => $technician->id,
        'status' => BookingStatus::Assigned,
    ]);

    $this->actingAs($technician, 'technician')
        ->patch(route('technician.jobs.update', $booking), [
            'status' => 'in_progress',
        ])
        ->assertRedirect();

    Mail::assertQueued(BookingStatusChangedMail::class, function (BookingStatusChangedMail $mail) use ($booking): bool {
        return $mail->recipientRole === 'customer'
            && $mail->booking->status === BookingStatus::InProgress
            && $mail->hasTo($booking->user->email);
    });

    Mail::assertQueued(BookingStatusChangedMail::class, fn (BookingStatusChangedMail $mail) => $mail->hasTo(config('mail.admin_address')));
});

it('emails customer, admin, and technician when a paid job is completed', function () {
    Mail::fake();

    $admin = Admin::factory()->create();
    $technician = Technician::factory()->create();
    $booking = Booking::factory()->paid()->create([
        'technician_id' => $technician->id,
        'status' => BookingStatus::InProgress,
    ]);

    $this->actingAs($technician, 'technician')
        ->patch(route('technician.jobs.update', $booking), [
            'status' => 'completed',
        ])
        ->assertRedirect(route('technician.jobs.index'));

    Mail::assertQueued(BookingStatusChangedMail::class, fn (BookingStatusChangedMail $mail) => $mail->hasTo($booking->user->email));
    Mail::assertQueued(BookingStatusChangedMail::class, fn (BookingStatusChangedMail $mail) => $mail->hasTo(config('mail.admin_address')));
    Mail::assertQueued(BookingStatusChangedMail::class, fn (BookingStatusChangedMail $mail) => $mail->hasTo($technician->email));
});

it('formats admin paid booking alert with customer name and schedule', function () {
    $booking = Booking::factory()->paid()->create([
        'scheduled_at' => now()->setTime(9, 30)->addDays(3),
    ]);

    $mail = new BookingConfirmedMail($booking->load(['user', 'service', 'vehicle']), 'admin');

    expect($mail->envelope()->subject)
        ->toContain($booking->user->name)
        ->toContain('booked for');
});

it('does not notify via notifier when booking is unpaid', function () {
    Mail::fake();

    Admin::factory()->create();
    $booking = Booking::factory()->create(['payment_status' => PaymentStatus::Unpaid]);

    app(BookingMailNotifier::class)->bookingConfirmed($booking);
    app(BookingMailNotifier::class)->bookingCancelled($booking);

    Mail::assertNothingQueued();
});
