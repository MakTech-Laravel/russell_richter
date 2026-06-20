<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminVehicleController extends Controller
{
    public function index(Request $request): Response
    {
        $vehicles = Vehicle::query()
            ->with('user')
            ->when($request->string('search')->toString(), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('vin', 'like', "%{$search}%")
                        ->orWhere('make', 'like', "%{$search}%")
                        ->orWhere('model', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->through(fn (Vehicle $vehicle) => [
                'id' => $vehicle->id,
                'display_name' => $vehicle->display_name,
                'vin' => $vehicle->vin,
                'mileage' => $vehicle->mileage,
                'customer' => $vehicle->user?->name,
                'customer_email' => $vehicle->user?->email,
            ]);

        return Inertia::render('backend/Admin/Vehicles/Index', [
            'vehicles' => $vehicles,
            'filters' => ['search' => $request->string('search')->toString()],
        ]);
    }
}
