<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'address', 'district', 'province'])]
class School extends Model
{
    public function sppgProfiles()
    {
        return $this->belongsToMany(SppgProfile::class, 'sppg_schools', 'school_id', 'sppg_id');
    }
}
