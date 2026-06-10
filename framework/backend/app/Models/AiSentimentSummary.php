<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'sppg_id',
    'summary_date',
    'total_reviews',
    'positive_count',
    'neutral_count',
    'negative_count',
    'key_points',
])]
class AiSentimentSummary extends Model
{
    protected $table = 'ai_sentiment_summaries';

    protected $casts = [
        'summary_date' => 'date:Y-m-d',
        'total_reviews' => 'integer',
        'positive_count' => 'integer',
        'neutral_count' => 'integer',
        'negative_count' => 'integer',
    ];

    public function sppg()
    {
        return $this->belongsTo(SppgProfile::class, 'sppg_id');
    }
}
