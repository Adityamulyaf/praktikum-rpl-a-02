<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DistributionStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class PublicDistributionController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->get('date', Carbon::today()->toDateString());

        $records = DistributionStatus::where('distributed_at', $date)
            ->with([
                'sppg:id,kitchen_name,district,province',
                'school:id,name,district',
            ])
            ->get();

        return response()->json($records);
    }
}
