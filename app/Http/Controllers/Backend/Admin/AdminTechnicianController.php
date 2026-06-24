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
            'technicians' => Technician::query()->latest()->get()->map(fn(Technician $t) => [
                'id' => $t->id,
                'name' => $t->name,
                'email' => $t->email,
                'phone' => $t->phone,
                'is_active' => $t->is_active,
                'bookings_count' => $t->bookings()->count(),
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('technicians', 'email')],
            'phone' => ['nullable', 'string', 'max:30'],
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
