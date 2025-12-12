<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $table = 'locations';

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getCompanyTableNameAttribute(): string
    {
        return 'group_' . str_replace(' ', '_', strtolower($this->company?->name ?? ''));
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function equipments()
    {
        return $this->hasMany(Equipment::class, 'location_id');
    }

    public function equipment()
    {
        return $this->hasMany(Equipment::class, 'location_id');
    }
}
