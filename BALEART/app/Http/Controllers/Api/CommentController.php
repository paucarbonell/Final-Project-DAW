<?php

namespace App\Http\Controllers\Api;

use App\Models\Comment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Obtener los comentarios del usuario autenticado.
     */
    public function getUserComments(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'No autorizado - usuario no autenticado'], 401);
        }

        $comments = Comment::where('user_id', $user->id)
            ->with('images', 'space')
            ->latest()
            ->paginate(10);

        return response()->json([
            'comments' => $comments,
            'message' => 'Comentarios obtenidos correctamente'
        ]);
    }

    /**
     * Eliminar un comentario del usuario autenticado.
     */
    public function deleteComment($id)
    {
        $user = auth()->user();
        $comment = Comment::where('id', $id)->where('user_id', $user->id)->first();

        if (!$comment) {
            return response()->json(['message' => 'Comentario no encontrado o no tienes permiso'], 403);
        }

        try {
            // Eliminar imágenes relacionadas antes de eliminar el comentario
            $comment->images()->delete();
            $comment->delete();

            return response()->json(['message' => 'Comentario eliminado correctamente']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el comentario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'comment' => 'required|string|max:255',
            'score' => 'required|numeric|min:0|max:5',
            'space_regNumber' => 'required|exists:spaces,regNumber', // Validar que existe el regNumber
        ]);

        // Obtener el ID real del espacio a partir del regNumber
        $space = \App\Models\Space::where('regNumber', $request->space_regNumber)->firstOrFail();

        $comment = Comment::create([
            'comment' => $request->comment,
            'score' => $request->score,
            'user_id' => Auth::id(),
            'space_id' => $space->id, // CORREGIDO: Guardamos space_id en vez de space_regNumber
        ]);

        return response()->json([
            'message' => 'Comentario creado correctamente',
            'comment' => $comment,
        ], 201);
    }
}
