<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['nisn', 'name', 'school_id'])]
class DapodikStudent extends Model
{
    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
