<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Service;
use App\Support\ServicePresenter;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminServiceController extends Controller
{
    public function index(): Response
    {
        $services = Service::query()
            ->withCount('bookings')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('backend/Admin/Services/Index', [
            'services' => ServicePresenter::adminList($services),
        ]);
    }

    public function store(StoreServiceRequest $request): RedirectResponse
    {
        Service::query()->create($request->validated());

        return back()->with('success', 'Service package created successfully.');
    }

    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $service->update($request->validated());

        return back()->with('success', 'Service package updated successfully.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        if ($service->bookings()->exists()) {
            return back()->with('error', 'Cannot delete a service with existing bookings. Deactivate it instead.');
        }

        $service->delete();

        return back()->with('success', 'Service package removed.');
    }
}
