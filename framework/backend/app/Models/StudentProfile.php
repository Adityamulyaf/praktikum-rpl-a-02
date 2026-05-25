<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'school_id', 'nisn'])]
class StudentProfile extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'ssid');
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
