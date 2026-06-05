<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['sppg_id', 'served_at', 'menu_name', 'components', 'calories', 'protein', 'carbs', 'fat'])]
class DailyMenu extends Model
{
    protected $casts = [
        'served_at' => 'date:Y-m-d',
    ];

    public function sppg()
    {
        return $this->belongsTo(SppgProfile::class, 'sppg_id');
    }
}
