<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Island;
use App\Models\Municipality;
use App\Models\Modality;
use App\Models\Service;

class FilterController extends Controller
{
    public function getFilters()
    {
        // Obtener islas y municipios solo si tienen espacios
        $islands = Island::whereHas('municipalities.addresses.space')->pluck('name');
        $municipalities = Municipality::whereHas('addresses.space')->pluck('name');

        // Obtener solo modalidades que tienen espacios asignados
        $modalities = Modality::whereHas('spaces')->get()->map(function ($modality) {
            return [
                'ca' => $modality->description_CA,
                'es' => $modality->description_ES,
                'en' => $modality->description_EN,
            ];
        });

        // Obtener solo servicios que tienen espacios asignados
        $services = Service::whereHas('spaces')->get()->map(function ($service) {
            return [
                'ca' => $service->description_CA,
                'es' => $service->description_ES,
                'en' => $service->description_EN,
            ];
        });

        return response()->json([
            'islands' => $islands,
            'municipalities' => $municipalities,
            'modalities' => $modalities,
            'services' => $services,
        ]);
    }
}
