<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Image;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\UserResource;
use App\Http\Requests\GuardarUserRequest;
use App\Models\Comment;

class UserController extends Controller
{

    public function show(Request $request)
    {
        $user = auth()->user(); // <-- Obtener el usuario autenticado

        if (!$user) {
            return response()->json(['message' => 'No autorizado - usuario no autenticado'], 401);
        }

        $user->load('spaces', 'comments', 'comments.images');

        return (new UserResource($user))->additional(['meta' => 'Usuari mostrat correctament']);
    }


    public function update(GuardarUserRequest $request, User $user)
    {
        try {
            $data = $request->only(['name', 'lastname', 'email']);

            // Si el usuario ha enviado una nueva contraseña, la encriptamos
            if ($request->filled('password')) {
                $data['password'] = bcrypt($request->password);
            }

            $user->update($data);

            return response()->json(['message' => 'Usuario actualizado correctamente', 'user' => $user]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(User $user)
    {
        // ELIMINACIÓ DE LES DADES
        try {
            $comments = Comment::where('user_id', $user->id);
            foreach ($comments as $comment) {
                $images = Image::where('comment_id', $comment->id);
                foreach ($images as $image) {
                    $image->delete();
                }

                $comment->delete();
            }

            $user->delete();
        } catch (\Exception $e) {
            return (new UserResource($user))->additional(['meta' => 'Error al eliminar l\'usuari: ' . $e->getMessage()]);
        }

        // SELECCIÓ DEL FORMAT DE LA RESPOSTA
        return (new UserResource($user))->additional(['meta' => 'Usuari eliminat correctament']);
    }
}
