<?php

namespace App\Http\Controllers\Backend\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Models\Vehicle;
use App\Services\VinDecoderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function __construct(private VinDecoderService $vinDecoder) {}

    public function index(Request $request): Response
    {
        $vehicles = $request->user()
            ->vehicles()
            ->latest()
            ->get()
            ->map(fn (Vehicle $vehicle) => $this->transformVehicle($vehicle));

        return Inertia::render('backend/User/Vehicles/Index', [
            'vehicles' => $vehicles,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('backend/User/Vehicles/Create');
    }

    public function store(StoreVehicleRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $decodeVin = $data['decode_vin'] ?? true;
        unset($data['decode_vin']);

        $data['vin'] = Str::upper($data['vin']);

        if ($decodeVin) {
            try {
                $decoded = $this->vinDecoder->decode($data['vin']);
                $data = array_merge($data, collect($decoded)->except('raw', 'vin')->filter()->all());
                $data['vin_decode_data'] = $decoded['raw'];
                $data['decoded_at'] = now();
            } catch (\Throwable) {
                // Allow manual entry if VIN decode fails.
            }
        }

        $request->user()->vehicles()->create($data);

        return redirect()->route('vehicles.index')->with('success', 'Vehicle added successfully.');
    }

    public function show(Vehicle $vehicle): Response
    {
        $this->authorize('view', $vehicle);

        return Inertia::render('backend/User/Vehicles/Show', [
            'vehicle' => $this->transformVehicle($vehicle),
        ]);
    }

    public function edit(Vehicle $vehicle): Response
    {
        $this->authorize('update', $vehicle);

        return Inertia::render('backend/User/Vehicles/Edit', [
            'vehicle' => $this->transformVehicle($vehicle),
        ]);
    }

    public function update(UpdateVehicleRequest $request, Vehicle $vehicle): RedirectResponse
    {
        $this->authorize('update', $vehicle);

        $vehicle->update($request->validated());

        return redirect()->route('vehicles.index')->with('success', 'Vehicle updated successfully.');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        $this->authorize('delete', $vehicle);

        $vehicle->delete();

        return redirect()->route('vehicles.index')->with('success', 'Vehicle removed successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function transformVehicle(Vehicle $vehicle): array
    {
        return [
            'id' => $vehicle->id,
            'vin' => $vehicle->vin,
            'year' => $vehicle->year,
            'make' => $vehicle->make,
            'model' => $vehicle->model,
            'trim' => $vehicle->trim,
            'engine' => $vehicle->engine,
            'fuel_type' => $vehicle->fuel_type,
            'body_class' => $vehicle->body_class,
            'drive_type' => $vehicle->drive_type,
            'mileage' => $vehicle->mileage,
            'license_plate' => $vehicle->license_plate,
            'color' => $vehicle->color,
            'display_name' => $vehicle->display_name,
            'decoded_at' => $vehicle->decoded_at?->toDateTimeString(),
        ];
    }
}
