<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    private const EQUIPMENT_RECORD_COLUMNS = [
        'id', 'location_id', 'equipment_id', 'myconveyor_id', 'local_id',
        'area', 'section', 'sub_section', 'track', 'customer_erp',
        'oem_code', 'oem_name', 'oem_description', 'supplier_name',
        'supplier_description', 'supplier_code', 'quantity', 'unit',
        'status_id', 'status_date', 'pdf_file', 'note'
    ];

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('locations/index', [
            'locations' => Location::query()
                ->with('company:id,name')
                ->withCount('equipments')
                ->orderBy('name')
                ->paginate(100)
                ->withQueryString(),
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
    public function show(Location $location): Response
    {
        return Inertia::render('locations/show', [
            'location' => $location->load(['company', 'equipments:id,name,slug,location_id']),
        ]);
    }

    /**
     * Display the specified resource in detail.
     */
    public function showEquipment(Location $location, Equipment $equipment): Response
    {
        $location->loadMissing('company');
        $tableName = $location->company_table_name;

        $columns = array_map(fn($col) => "{$tableName}.{$col}", self::EQUIPMENT_RECORD_COLUMNS);
        $columns[] = 'categories.name as category';

        $records = DB::table($tableName)
            ->select($columns)
            ->leftJoin('categories', "{$tableName}.category_id", '=', 'categories.id')
            ->where("{$tableName}.equipment_id", $equipment->id)
            ->where("{$tableName}.location_id", $location->id)
            ->orderBy("{$tableName}.myconveyor_id")
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
