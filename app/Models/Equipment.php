<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    protected $table = 'equipments';

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id');
    }
}
