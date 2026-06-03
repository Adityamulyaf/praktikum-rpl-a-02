<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['sppg_id', 'school_id', 'distributed_at', 'status', 'status_updated_at'])]
class DistributionStatus extends Model
{
    protected $casts = [
        'distributed_at'    => 'date:Y-m-d',
        'status_updated_at' => 'datetime',
    ];

    public function sppg()
    {
        return $this->belongsTo(SppgProfile::class, 'sppg_id');
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
