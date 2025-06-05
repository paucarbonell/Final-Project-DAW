<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pack extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'cards_per_pack',
        'description',
    ];

    public function packOpenings()
    {
        return $this->hasMany(PackOpening::class);
    }

    public function cards()
    {
        return $this->hasMany(Card::class);
    }
}
