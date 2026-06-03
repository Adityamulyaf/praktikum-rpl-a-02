<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'user_id', 'kitchen_name', 'address', 'district', 'province',
    'contact_person_name', 'contact_phone', 'contact_email',
    'description', 'production_capacity', 'is_active',
])]
class SppgProfile extends Model
{
    protected $table = 'sppg_profiles';

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'ssid');
    }

    public function schools()
    {
        return $this->belongsToMany(School::class, 'sppg_schools', 'sppg_id', 'school_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'sppg_id');
    }
}
