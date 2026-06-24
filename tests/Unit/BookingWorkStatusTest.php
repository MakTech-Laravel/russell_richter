<?php

use App\Enums\BookingStatus;

it('maps booking statuses to work labels', function () {
    expect(BookingStatus::Pending->workLabel())->toBe('Work Pending')
        ->and(BookingStatus::InProgress->workLabel())->toBe('Work In Progress')
        ->and(BookingStatus::Completed->workLabel())->toBe('Work Completed');
});

it('tracks work progress steps', function () {
    expect(BookingStatus::Pending->workProgressStep())->toBe(1)
        ->and(BookingStatus::Assigned->workProgressStep())->toBe(2)
        ->and(BookingStatus::InProgress->workProgressStep())->toBe(3)
        ->and(BookingStatus::Completed->workProgressStep())->toBe(4)
        ->and(BookingStatus::Cancelled->workProgressStep())->toBe(0);
});

it('knows when work is done or still pending', function () {
    expect(BookingStatus::Completed->isWorkDone())->toBeTrue()
        ->and(BookingStatus::Pending->isWorkPending())->toBeTrue()
        ->and(BookingStatus::Completed->isWorkPending())->toBeFalse();
});
