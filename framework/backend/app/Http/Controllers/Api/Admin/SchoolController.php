<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    public function index()
    {
        return response()->json(School::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'address'  => 'nullable|string',
            'district' => 'required|string|max:100',
            'province' => 'required|string|max:100',
        ]);

        $school = School::create($request->only('name', 'address', 'district', 'province'));

        return response()->json($school, 201);
    }

    public function show(School $school)
    {
        return response()->json($school->load('sppgProfiles:id,kitchen_name,district'));
    }

    public function update(Request $request, School $school)
    {
        $request->validate([
            'name'     => 'sometimes|string|max:255',
            'address'  => 'nullable|string',
            'district' => 'sometimes|string|max:100',
            'province' => 'sometimes|string|max:100',
        ]);

        $school->update($request->only('name', 'address', 'district', 'province'));

        return response()->json($school);
    }

    public function destroy(School $school)
    {
        $school->delete();

        return response()->json(['message' => 'Sekolah dihapus']);
    }
}
