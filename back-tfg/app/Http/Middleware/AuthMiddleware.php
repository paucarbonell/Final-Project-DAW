<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::guard('sanctum')->check()) {
            $user = Auth::guard('sanctum')->user();
            Auth::setUser($user);
            $request->setUserResolver(function () use ($user) {
                return $user;
            });
            return $next($request);
        }

        return response()->json(['Error' => 'Unauthorized'], 401);
    }
}

