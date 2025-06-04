<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'comment',
        'score',
        'status',
        'user_id',
        'space_id',
    ];

    /**
     * Un comentario puede tener varias imágenes.
     */
    public function images()
    {
        return $this->hasMany(Image::class);
    }

    /**
     * Un comentario pertenece a un usuario.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Un comentario pertenece a un espacio.
     */
    public function space()
    {
        return $this->belongsTo(Space::class);
    }
}
