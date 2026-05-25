<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;

class PublicController extends Controller
{
    public function schools()
    {
        $schools = School::select('id', 'name', 'district', 'province')
            ->orderBy('name')
            ->get();

        return response()->json($schools);
    }
}
