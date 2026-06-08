<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'school_id', 'sppg_id', 'review_date', 'content', 'photo', 'flag_status', 'flag_reason', 'is_critical'])]
class Review extends Model
{
    protected $casts = [
        'review_date' => 'date:Y-m-d',
        'is_critical' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'ssid');
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function sppg()
    {
        return $this->belongsTo(SppgProfile::class, 'sppg_id');
    }

    public function followUp()
    {
        return $this->hasOne(CriticalReviewFollowup::class, 'review_id');
    }
}
