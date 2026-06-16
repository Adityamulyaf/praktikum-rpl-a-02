<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['nip', 'name', 'school_id'])]
class DapodikTeacher extends Model
{
    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
