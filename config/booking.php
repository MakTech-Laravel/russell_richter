<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Appointment Duration
    |--------------------------------------------------------------------------
    |
    | Default service duration in minutes used when calculating slot occupancy.
    |
    */

    'appointment_duration_minutes' => (int) env('BOOKING_APPOINTMENT_DURATION', 30),

    /*
    |--------------------------------------------------------------------------
    | Buffer Between Appointments
    |--------------------------------------------------------------------------
    |
    | Minimum idle time required between consecutive appointments.
    |
    */

    'buffer_minutes' => (int) env('BOOKING_BUFFER_MINUTES', 30),

    /*
    |--------------------------------------------------------------------------
    | Business Hours
    |--------------------------------------------------------------------------
    */

    'business_hours' => [
        'start' => env('BOOKING_BUSINESS_START', '08:00'),
        'end' => env('BOOKING_BUSINESS_END', '18:00'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Business Days
    |--------------------------------------------------------------------------
    |
    | ISO-8601 numeric representation of the day of the week (1 = Monday).
    |
    */

    'business_days' => [1, 2, 3, 4, 5],

    /*
    |--------------------------------------------------------------------------
    | Slot Interval
    |--------------------------------------------------------------------------
    */

    'slot_interval_minutes' => (int) env('BOOKING_SLOT_INTERVAL', 30),

];
