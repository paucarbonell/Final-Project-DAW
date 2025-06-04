<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CardUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'card_id',
        'from_pack_opening_id',
        'obtained_at',
    ];

    protected $casts = [
        'obtained_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function card()
    {
        return $this->belongsTo(Card::class);
    }

    public function packOpening()
    {
        return $this->belongsTo(PackOpening::class, 'from_pack_opening_id');
    }
}
