<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\Technician;
use App\Services\RouteOptimizationService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminRouteController extends Controller
{
    public function __construct(private RouteOptimizationService $routeOptimizationService) {}

    public function index(Request $request): Response
    {
        $date = $request->date('date') ?? today();
        $technicianId = $request->integer('technician_id');

        $technicians = Technician::query()->where('is_active', true)->get(['id', 'name']);
        $selectedTechnician = $technicianId
            ? $technicians->firstWhere('id', $technicianId)
            : $technicians->first();

        $routes = collect();

        if ($selectedTechnician) {
            $routes = $selectedTechnician->bookings()
                ->with(['user', 'vehicle', 'service'])
                ->whereDate('scheduled_at', $date)
                ->orderBy('route_order')
                ->orderBy('scheduled_at')
                ->get()
                ->map(fn ($b) => [
                    'id' => $b->id,
                    'route_order' => $b->route_order,
                    'customer' => $b->user?->name,
                    'vehicle' => $b->vehicle?->display_name,
                    'service' => $b->service?->name,
                    'address' => "{$b->service_address}, {$b->service_city}, {$b->service_state} {$b->service_zip}",
                    'scheduled_at' => $b->scheduled_at->format('g:i A'),
                    'status' => $b->status->label(),
                    'latitude' => $b->latitude,
                    'longitude' => $b->longitude,
                ]);
        }

        return Inertia::render('backend/Admin/Routes/Index', [
            'technicians' => $technicians,
            'selectedTechnicianId' => $selectedTechnician?->id,
            'date' => $date->toDateString(),
            'routes' => $routes,
        ]);
    }

    public function optimize(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'technician_id' => ['required', 'exists:technicians,id'],
            'date' => ['required', 'date'],
        ]);

        $technician = Technician::query()->findOrFail($validated['technician_id']);
        $this->routeOptimizationService->optimizeForTechnician($technician, Carbon::parse($validated['date']));

        return back()->with('success', 'Route optimized successfully.');
    }
}
