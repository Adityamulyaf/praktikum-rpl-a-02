<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FollowupHistory extends Model
{
    protected $table = 'followup_histories';

    public $timestamps = false;

    protected $fillable = [
        'followup_id',
        'previous_status',
        'new_status',
        'note',
        'changed_by',
        'changed_at',
    ];

    protected $casts = [
        'changed_at' => 'datetime',
    ];

    public function followup()
    {
        return $this->belongsTo(CriticalReviewFollowup::class, 'followup_id');
    }

    public function changer()
    {
        return $this->belongsTo(User::class, 'changed_by', 'ssid');
    }
}
