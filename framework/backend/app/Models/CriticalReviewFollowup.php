<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CriticalReviewFollowup extends Model
{
    protected $table = 'critical_review_followups';

    protected $fillable = [
        'review_id',
        'sppg_id',
        'followup_status',
        'handling_note',
        'updated_by',
    ];

    public function review()
    {
        return $this->belongsTo(Review::class, 'review_id');
    }

    public function sppg()
    {
        return $this->belongsTo(SppgProfile::class, 'sppg_id');
    }

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by', 'ssid');
    }

    public function histories()
    {
        return $this->hasMany(FollowupHistory::class, 'followup_id')->orderBy('changed_at', 'desc');
    }
}
