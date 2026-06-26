<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\Technician;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminTechnicianController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('backend/Admin/Technicians/Index', [
            'technicians' => Technician::query()->latest()->get()->map(fn (Technician $t) => [
                'id' => $t->id,
                'name' => $t->name,
                'email' => $t->email,
                'phone' => $t->phone,
                'address' => $t->address,
                'city' => $t->city,
                'state' => $t->state,
                'zip' => $t->zip,
                'is_active' => $t->is_active,
                'bookings_count' => $t->bookings()->count(),
            ]),
        ]);
    }

    public function show(Technician $technician): Response
    {
        $technician->load(['bookings.service', 'bookings.vehicle']);

        return Inertia::render('backend/Admin/Technicians/Show', [
            'technician' => [
                'id' => $technician->id,
                'name' => $technician->name,
                'email' => $technician->email,
                'phone' => $technician->phone,
                'address' => $technician->address,
                'city' => $technician->city,
                'state' => $technician->state,
                'zip' => $technician->zip,
                'is_active' => $technician->is_active,
            ],
            'bookings' => $technician->bookings->map(fn ($b) => [
                'id' => $b->id,
                'route_key' => $b->getRouteKey(),
                'service' => $b->service?->name,
                'vehicle' => $b->vehicle?->display_name,
                'status' => $b->status->label(),
                'scheduled_at' => $b->scheduled_at->toDateTimeString(),
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('technicians', 'email')],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:50'],
            'zip' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        unset($validated['password_confirmation']);

        Technician::query()->create($validated);

        return back()->with('success', 'Technician created successfully.');
    }

    public function update(Request $request, Technician $technician): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('technicians', 'email')->ignore($technician->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:50'],
            'zip' => ['nullable', 'string', 'max:20'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if (blank($validated['password'] ?? null)) {
            unset($validated['password']);
        }

        unset($validated['password_confirmation']);

        if ($request->has('is_active')) {
            $validated['is_active'] = $request->boolean('is_active');
        }

        $technician->update($validated);

        return back()->with('success', 'Technician updated successfully.');
    }

    public function destroy(Technician $technician): RedirectResponse
    {
        $technician->delete();

        return back()->with('success', 'Technician removed.');
    }
}
