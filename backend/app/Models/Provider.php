<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'specialty',
        'email',
        'phone',
        'availability',
    ];

    protected $casts = [
        'availability' => 'array',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function getAvailableSlotsAttribute()
    {
        return $this->availability ?? [];
    }
}