<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function packOpenings()
    {
        return $this->hasMany(PackOpening::class);
    }

    public function cardUsers()
    {
        return $this->hasMany(CardUser::class);
    }

    public function cards()
    {
        return $this->belongsToMany(Card::class, 'card_users');
    }
}

