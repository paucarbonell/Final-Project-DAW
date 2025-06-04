<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Card extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'image_url',
        'rarity',
        'is_shiny',
        'type_1',
        'type_2',
        'pack_id',
    ];

    protected $casts = [
        'is_shiny' => 'boolean',
    ];

    public function cardUsers()
    {
        return $this->hasMany(CardUser::class);
    }

    public function pack()
    {
        return $this->belongsTo(Pack::class);
    }
}
