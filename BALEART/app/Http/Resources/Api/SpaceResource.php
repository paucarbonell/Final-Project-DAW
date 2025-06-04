<?php

namespace App\Http\Resources\Api;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\SpaceType;
use App\Http\Resources\Api\AddressResource;
use Illuminate\Http\Resources\Json\JsonResource;

class SpaceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'identificador' => $this->id,
            'nom' => Str::upper($this->name),
            'registre' => $this->regNumber,

            // Observaciones en todos los idiomas
            'observacions' => [
                'ca' => $this->observation_CA,
                'es' => $this->observation_ES,
                'en' => $this->observation_EN,
            ],

            // Datos del gestor/a
            'gestor/a' => new UserResource($this->whenLoaded('user')),

            // Tipos de espacio en todos los idiomas
            'tipus' => $this->getAllTranslatedSpaceType(),

            'adreça' => new AddressResource($this->whenLoaded('address')),
            'illa' => $this->address->municipality->island->name,
            'telefon' => $this->phone,
            'email' => $this->email,
            'www' => $this->website,
            'acces' => $this->accessType === 'y' ? 'Sí' : ($this->accessType === 'N' ? 'No' : 'Parcialment accessible'),
            'mitjanaEstatica' => $this->countScore === 0 ? null : round($this->totalScore / $this->countScore, 2),
            'mitjanaDinamica' => round($this->calculaMitjana(), 2),

            // Modalidades en todos los idiomas
            'modalitats' => $this->modalities->map(function ($modality) {
                return [
                    'ca' => $modality->description_CA,
                    'es' => $modality->description_ES,
                    'en' => $modality->description_EN,
                ];
            }),

            // Servicios en todos los idiomas
            'serveis' => $this->services->map(function ($service) {
                return [
                    'ca' => $service->description_CA,
                    'es' => $service->description_ES,
                    'en' => $service->description_EN,
                ];
            }),

            'comentaris' => CommentResource::collection($this->whenLoaded('comments')),
        ];
    }

    // Función para obtener todos los tipos de espacio traducidos
    private function getAllTranslatedSpaceType()
    {
        $spaceType = $this->space_type_id ? SpaceType::find($this->space_type_id) : null;
        return [
            'ca' => $spaceType ? $spaceType->description_CA : null,
            'es' => $spaceType ? $spaceType->description_ES : null,
            'en' => $spaceType ? $spaceType->description_EN : null,
        ];
    }
}
