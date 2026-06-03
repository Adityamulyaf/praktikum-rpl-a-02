<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SppgProfile;

class PublicSppgController extends Controller
{
    public function index()
    {
        $sppgs = SppgProfile::where('is_active', true)
            ->select('id', 'kitchen_name', 'district', 'province',
                     'contact_phone', 'production_capacity', 'description')
            ->withCount('schools')
            ->orderBy('kitchen_name')
            ->get();

        return response()->json($sppgs);
    }

    public function show($id)
    {
        $sppg = SppgProfile::where('is_active', true)
            ->with('schools:id,name,district,province')
            ->findOrFail($id);

        return response()->json([
            'id'                  => $sppg->id,
            'kitchen_name'        => $sppg->kitchen_name,
            'is_active'           => $sppg->is_active,
            'address'             => $sppg->address,
            'district'            => $sppg->district,
            'province'            => $sppg->province,
            'contact_person_name' => $sppg->contact_person_name,
            'contact_phone'       => $sppg->contact_phone,
            'contact_email'       => $sppg->contact_email,
            'production_capacity' => $sppg->production_capacity,
            'description'         => $sppg->description,
            'schools'             => $sppg->schools,
        ]);
    }
}
