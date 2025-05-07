<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PackOpening extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'pack_id',
        'opened_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pack()
    {
        return $this->belongsTo(Pack::class);
    }

    public function cardUsers()
    {
        return $this->hasMany(CardUser::class, 'from_pack_opening_id');
    }
}
