<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SppgProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

class SppgController extends Controller
{
    public function index(Request $request)
    {
        $query = SppgProfile::with(['user:ssid,name,email,phone_number,is_active', 'schools:id,name,district']);

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('kitchen_name', 'ilike', $search)
                  ->orWhere('district', 'ilike', $search)
                  ->orWhere('province', 'ilike', $search)
                  ->orWhereHas('user', function ($qu) use ($search) {
                      $qu->where('name', 'ilike', $search)
                         ->orWhere('email', 'ilike', $search);
                  });
            });
        }

        $sppgs = $query->get();

        return response()->json($sppgs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'                 => 'required|string|max:255',
            'email'                => 'required|email|unique:users,email',
            'password'             => ['required', Password::min(8)],
            'phone_number'         => 'nullable|string|max:20',
            'kitchen_name'         => 'required|string|max:255',
            'address'              => 'required|string',
            'district'             => 'required|string|max:100',
            'city'                 => 'required|string|max:100',
            'province'             => 'required|string|max:100',
            'contact_person_name'  => 'required|string|max:255',
            'contact_phone'        => 'required|string|max:20',
            'contact_email'        => 'nullable|email|max:255',
            'description'          => 'nullable|string',
            'production_capacity'  => 'nullable|integer|min:1',
        ]);

        $sppg = DB::transaction(function () use ($request) {
            $user = User::create([
                'name'         => $request->name,
                'email'        => $request->email,
                'password'     => $request->password,
                'role'         => 'sppg',
                'phone_number' => $request->phone_number,
                'is_active'    => true,
            ]);

            return SppgProfile::create([
                'user_id'              => $user->ssid,
                'kitchen_name'         => $request->kitchen_name,
                'address'              => $request->address,
                'district'             => $request->district,
                'city'                 => $request->city,
                'province'             => $request->province,
                'contact_person_name'  => $request->contact_person_name,
                'contact_phone'        => $request->contact_phone,
                'contact_email'        => $request->contact_email,
                'description'          => $request->description,
                'production_capacity'  => $request->production_capacity,
            ]);
        });

        return response()->json($sppg->load('user:ssid,name,email,phone_number,is_active'), 201);
    }

    public function show(SppgProfile $sppg)
    {
        return response()->json(
            $sppg->load(['user:ssid,name,email,phone_number,is_active', 'schools'])
        );
    }

    public function update(Request $request, SppgProfile $sppg)
    {
        $request->validate([
            'kitchen_name'         => 'sometimes|string|max:255',
            'address'              => 'sometimes|string',
            'district'             => 'sometimes|string|max:100',
            'city'                 => 'sometimes|string|max:100',
            'province'             => 'sometimes|string|max:100',
            'contact_person_name'  => 'sometimes|string|max:255',
            'contact_phone'        => 'sometimes|string|max:20',
            'contact_email'        => 'nullable|email|max:255',
            'description'          => 'nullable|string',
            'production_capacity'  => 'nullable|integer|min:1',
            'is_active'            => 'sometimes|boolean',
        ]);

        $sppg->update($request->only([
            'kitchen_name', 'address', 'district', 'city', 'province',
            'contact_person_name', 'contact_phone', 'contact_email',
            'description', 'production_capacity', 'is_active',
        ]));

        if ($request->has('contact_phone') && $sppg->user) {
            $sppg->user->update(['phone_number' => $request->contact_phone]);
        }

        if ($request->has('is_active')) {
            $sppg->user->update(['is_active' => $request->boolean('is_active')]);
        }

        return response()->json($sppg->load('user:ssid,name,email,phone_number,is_active'));
    }

    public function destroy(SppgProfile $sppg)
    {
        $sppg->update(['is_active' => false]);
        $sppg->user->update(['is_active' => false]);

        return response()->json(['message' => 'SPPG dinonaktifkan']);
    }
}
