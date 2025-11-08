<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $locations = Location::with('company:id,name')
            ->withCount('equipments')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('locations/index', [
            'locations' => $locations,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $location = Location::with(['company', 'equipments:id,name,slug,location_id'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Pass to Inertia
        return Inertia::render('locations/show', [
            'location' => $location,
        ]);
    }

    /**
     * Display the specified resource in detail.
     */
    public function showEquipment(Location $location, Equipment $equipment)
    {
        // Eager load the company
        $location->load('company');

        // Build the company table name
        $companyName = null;
        if ($location->company) {
            $companyName = str_replace(' ', '_', strtolower($location->company->name));
        }
        $companyTable = 'group_' . $companyName;

        // Fetch only the specified columns
        $records = DB::table($companyTable)
            ->select(
                'id', 'location_id', 'equipment_id', 'myconveyor_id', 'local_id', 'area', 'section',
                'sub_section', 'track', 'category_id', 'customer_erp', 'oem_code', 'oem_name', 'oem_description',
                'supplier_name', 'supplier_description', 'supplier_code', 'quantity', 'unit', 'status_id', 'status_date',
                'pdf_file', 'note'
            )
            ->where('equipment_id', $equipment->id)
            ->where('location_id', $location->id)
            ->get();

        // Pass data to Inertia view
        return Inertia::render('locations/show-equipment', [
            'equipment' => $equipment,
            'location' => $location,
            'records' => $records,
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
