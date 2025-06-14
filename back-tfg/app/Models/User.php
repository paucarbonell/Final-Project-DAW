<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Log;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'last_pack_opened_at',
        'daily_pack_count',
        'total_cards'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'last_pack_opened_at' => 'datetime',
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
        return $this->belongsToMany(Card::class, 'card_user');
    }

    public function canOpenPack()
    {
        // Eliminar logs
        // Log::info('canOpenPack called for user: ' . $this->id);
        // Log::info('Daily pack count: ' . $this->daily_pack_count);

        // Verificar el límite diario (5 sobres por día)
        if ($this->daily_pack_count >= 5) {
            // Log::info('Daily limit reached.'); // Eliminar log
            return false;
        }

        // Verificar el cooldown de 3 horas
        if ($this->last_pack_opened_at) {
            // Asegurarse de que ambas fechas estén en UTC para una comparación precisa
            $lastOpenedUtc = $this->last_pack_opened_at->clone()->setTimezone('UTC');
            $currentTimeUtc = now()->setTimezone('UTC');

            // Eliminar logs de fechas y tiempos
            // Log::info('Last pack opened at (UTC): ' . $lastOpenedUtc->toDateTimeString());
            // Log::info('Current time (UTC): ' . $currentTimeUtc->toDateTimeString());

            $cooldownSeconds = 3 * 60 * 60; // 3 horas en segundos
            $cooldownExpirationUtc = $lastOpenedUtc->addSeconds($cooldownSeconds);
            
            // Eliminar log de Cooldown expiration
            // Log::info('Cooldown expiration (UTC): ' . $cooldownExpirationUtc->toDateTimeString());

            if ($currentTimeUtc->lessThan($cooldownExpirationUtc)) {
                $remainingSeconds = $currentTimeUtc->diffInSeconds($cooldownExpirationUtc);
                // Eliminar log de Still in cooldown
                // Log::info('Still in cooldown. Remaining seconds: ' . $remainingSeconds);
                return false;
            }
        } else {
            // Eliminar log de No last pack opened at timestamp
            // Log::info('No last pack opened at timestamp.');
        }

        // Eliminar log de Can open pack
        // Log::info('Can open pack: true');
        return true;
    }

    public function getPackOpeningStats()
    {
        return [
            'packs_opened_today' => $this->daily_pack_count,
            'total_packs_opened' => $this->packOpenings()->count(),
            'last_pack_opened' => $this->last_pack_opened_at,
            'can_open_pack' => $this->canOpenPack(),
            'remaining_cooldown' => $this->canOpenPack() ? 0 : 
                3 - now()->diffInHours($this->last_pack_opened_at)
        ];
    }
}

