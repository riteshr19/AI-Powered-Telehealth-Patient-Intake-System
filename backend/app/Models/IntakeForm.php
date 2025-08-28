<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IntakeForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'chief_complaint',
        'current_medications',
        'allergies',
        'medical_history',
        'social_history',
        'family_history',
        'review_of_systems',
        'vital_signs',
        'processed',
        'ai_summary',
        'risk_assessment',
    ];

    protected $casts = [
        'vital_signs' => 'array',
        'processed' => 'boolean',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function markAsProcessed($aiSummary = null, $riskAssessment = null)
    {
        $this->update([
            'processed' => true,
            'ai_summary' => $aiSummary,
            'risk_assessment' => $riskAssessment,
        ]);
    }
}