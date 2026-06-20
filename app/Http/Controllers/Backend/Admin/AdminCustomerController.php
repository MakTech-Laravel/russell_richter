<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminCustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $customers = User::query()
            ->withCount(['vehicles', 'bookings'])
            ->when($request->string('search')->toString(), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'city' => $user->city,
                'vehicles_count' => $user->vehicles_count,
                'bookings_count' => $user->bookings_count,
                'created_at' => $user->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('backend/Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => ['search' => $request->string('search')->toString()],
        ]);
    }

    public function show(User $customer): Response
    {
        $customer->load(['vehicles', 'bookings.service', 'bookings.vehicle']);

        return Inertia::render('backend/Admin/Customers/Show', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'address_line' => $customer->address_line,
                'city' => $customer->city,
                'state' => $customer->state,
                'zip' => $customer->zip,
            ],
            'vehicles' => $customer->vehicles->map(fn ($v) => [
                'id' => $v->id,
                'display_name' => $v->display_name,
                'vin' => $v->vin,
                'mileage' => $v->mileage,
            ]),
            'bookings' => $customer->bookings->map(fn ($b) => [
                'id' => $b->id,
                'service' => $b->service?->name,
                'vehicle' => $b->vehicle?->display_name,
                'status' => $b->status->label(),
                'scheduled_at' => $b->scheduled_at->toDateTimeString(),
            ]),
        ]);
    }
}
