<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Image;
use App\Models\Space;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\Api\SpaceResource;
use App\Http\Resources\Api\CommentResource;
use App\Http\Requests\GuardarCommentRequest;

class SpaceController extends Controller
{

    /*
    public function index()
    {
        // SELECCIÓ DE LES DADES
        //$spaces = Space::all();
        $spaces = Space::with(["address", "modalities", "services", "spaceType", "comments", "comments.images", "user"])->get();

        // SELECCIÓ DE LA RESPOSTA
        //return response()->json($spaces);  // --> torna una resposta serialitzada en format 'json'
        return (SpaceResource::collection($spaces))->additional(['meta' => 'Espais mostrats correctament']);  // torna una resposta personalitzada
    }
*/

    public function index(Request $request)
    {
        // Construcción de la consulta inicial con las relaciones necesarias
        $query = Space::with([
            "address",
            "address.municipality.island",
            "modalities",
            "services",
            "spaceType",
            "comments",
            "comments.images",
            "user",
        ]);

        // Filtrar por isla
        $query->when($request->illa, function ($q) use ($request) {
            $q->whereHas('address.municipality.island', function ($q) use ($request) {
                $q->where('name', $request->illa);
            });
        });

        // Filtrar por tipo de espacio
        $query->when($request->type, function ($q) use ($request) {
            $q->whereHas('spaceType', function ($q) use ($request) {
                $q->where('description_CA', 'like', '%' . $request->type . '%')
                    ->orWhere('description_ES', 'like', '%' . $request->type . '%')
                    ->orWhere('description_EN', 'like', '%' . $request->type . '%');
            });
        });

        // Filtrar por municipio
        $query->when($request->municipality, function ($q) use ($request) {
            $q->whereHas('address.municipality', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->municipality . '%');
            });
        });

        // Filtrar por modalidades
        $query->when($request->modalities, function ($q) use ($request) {
            $modalities = explode(',', $request->modalities);
            $q->whereHas('modalities', function ($q) use ($modalities) {
                $q->whereIn('id', $modalities);
            });
        });

        // Filtrar por servicios
        $query->when($request->services, function ($q) use ($request) {
            $services = explode(',', $request->services);
            $q->whereHas('services', function ($q) use ($services) {
                $q->whereIn('id', $services);
            });
        });

        // Obtener los resultados filtrados
        $spaces = $query->get();

        // Retornar la respuesta como una colección de recursos personalizada
        return SpaceResource::collection($spaces)->additional(['meta' => 'Espacios mostrados correctamente']);
    }


    public function show(Space $space)
    {
        // AFEGINT DADES AMB 'load()'
        $space->load('address')->load('modalities')->load('services')->load('spaceType')->load('comments')->load('comments.images')->load('user');
        //return response()->json($space);
        return (new SpaceResource($space))->additional(['meta' => 'Espai mostrat correctament']);
    }

    // public function store(Request $request)
    public function store(Request $request)
    {
        $space_id = Space::where('regNumber', $request->regNumber)->first()->id;
        $ncomentaris = 0;
        $nimatges = 0;

        foreach ($request->comments as $comment) {
            $c = Comment::create(
                [
                    'comment' => $comment['comment'],
                    'score' => $comment['score'],
                    'user_id' => Auth::check()
                        ? Auth::id()
                        : ($request->has('email')
                            ? User::where('email', $request->email)->first()->id
                            : User::where('name', 'admin')->value('id')),
                    'space_id' => $space_id,
                ]
            );
            $ncomentaris++;

            foreach ($comment['images'] as $image) {
                $i = Image::create(
                    [
                        'comment_id' => $c->id,
                        'url' => $image['url'],
                    ]
                );
                $nimatges++;
            }
        }

        return response()->json(['meta' => $ncomentaris . ' comentaris creats correctament amb ' . $nimatges . ' imatges']);
        //return (new CommentResource($comment))->additional(['meta' => 'Comentaris creats correctament']);
    }
}
