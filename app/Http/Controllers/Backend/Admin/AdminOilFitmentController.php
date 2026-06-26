<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\OilFitment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminOilFitmentController extends Controller
{
    public function index(Request $request): Response
    {
        $fitments = OilFitment::query()
            ->when($request->string('search')->toString(), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('make', 'like', "%{$search}%")
                        ->orWhere('model', 'like', "%{$search}%")
                        ->orWhere('oil_filter_part_no', 'like', "%{$search}%");
                });
            })
            ->orderBy('make')
            ->orderBy('model')
            ->orderBy('year_from')
            ->orderBy('engine')
            ->get()
            ->map(fn (OilFitment $f) => [
                'id' => $f->id,
                'make' => $f->make,
                'model' => $f->model,
                'year_from' => $f->year_from,
                'year_to' => $f->year_to,
                'engine' => $f->engine,
                'oil_filter_part_no' => $f->oil_filter_part_no,
                'oil_filter_brand' => $f->oil_filter_brand,
                'oil_grade' => $f->oil_grade,
                'oil_capacity_quarts' => $f->oil_capacity_quarts,
                'supports_synthetic' => $f->supports_synthetic,
            ]);

        return Inertia::render('backend/Admin/OilFitments/Index', [
            'fitments' => $fitments,
            'filters' => ['search' => $request->string('search')->toString()],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'make' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'year_from' => ['required', 'integer', 'min:1990', 'max:2100'],
            'year_to' => ['required', 'integer', 'min:1990', 'max:2100', 'gte:year_from'],
            'engine' => ['nullable', 'string', 'max:100'],
            'oil_filter_part_no' => ['required', 'string', 'max:60'],
            'oil_filter_brand' => ['nullable', 'string', 'max:100'],
            'oil_grade' => ['required', 'string', 'max:20'],
            'oil_capacity_quarts' => ['required', 'numeric', 'min:0.5', 'max:30'],
            'supports_synthetic' => ['sometimes', 'boolean'],
        ]);

        $validated['supports_synthetic'] = $request->boolean('supports_synthetic', true);

        OilFitment::query()->create($validated);

        return back()->with('success', 'Oil fitment record added.');
    }

    public function update(Request $request, OilFitment $oilFitment): RedirectResponse
    {
        $validated = $request->validate([
            'make' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'year_from' => ['required', 'integer', 'min:1990', 'max:2100'],
            'year_to' => ['required', 'integer', 'min:1990', 'max:2100', 'gte:year_from'],
            'engine' => ['nullable', 'string', 'max:100'],
            'oil_filter_part_no' => ['required', 'string', 'max:60'],
            'oil_filter_brand' => ['nullable', 'string', 'max:100'],
            'oil_grade' => ['required', 'string', 'max:20'],
            'oil_capacity_quarts' => ['required', 'numeric', 'min:0.5', 'max:30'],
            'supports_synthetic' => ['sometimes', 'boolean'],
        ]);

        $validated['supports_synthetic'] = $request->boolean('supports_synthetic');

        $oilFitment->update($validated);

        return back()->with('success', 'Oil fitment record updated.');
    }

    public function destroy(OilFitment $oilFitment): RedirectResponse
    {
        $oilFitment->delete();

        return back()->with('success', 'Oil fitment record removed.');
    }
}
