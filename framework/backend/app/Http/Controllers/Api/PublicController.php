<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function schools(Request $request)
    {
        $q = trim($request->get('q', ''));

        if (strlen($q) < 2) {
            return response()->json([]);
        }

        $schools = School::select('id', 'name', 'district', 'province')
            ->with(['sppgProfiles:id,kitchen_name,address,district,province'])
            ->where(function ($query) use ($q) {
                $query->where('name', 'ilike', '%' . $q . '%')
                    ->orWhere('district', 'ilike', '%' . $q . '%')
                    ->orWhere('province', 'ilike', '%' . $q . '%');
            })
            ->orderBy('name')
            ->limit(20)
            ->get();

        return response()->json($schools);
    }
}
