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
        $location->load('company');

        $companyTable = 'group_' . str_replace(' ', '_', strtolower($location->company?->name ?? ''));

        $columns = [
            'id',
            'location_id',
            'equipment_id',
            'myconveyor_id',
            'local_id',
            'area',
            'section',
            'sub_section',
            'track',
            'category_id',
            'customer_erp',
            'oem_code',
            'oem_name',
            'oem_description',
            'supplier_name',
            'supplier_description',
            'supplier_code',
            'quantity',
            'unit',
            'status_id',
            'status_date',
            'pdf_file',
            'note',
        ];

        $columns = array_map(fn($col) => "$companyTable.$col", $columns);
        $columns[] = 'categories.name as category';

        $records = DB::table($companyTable)
            ->select($columns)
            ->leftJoin('categories', "$companyTable.category_id", '=', 'categories.id')
            ->where("$companyTable.equipment_id", $equipment->id)
            ->where("$companyTable.location_id", $location->id)
            ->orderBy("$companyTable.myconveyor_id", 'asc')
            ->get();

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
