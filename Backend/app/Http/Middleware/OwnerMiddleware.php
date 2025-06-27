<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class OwnerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $pegawai = Auth::guard('pegawai')->user();
        if($pegawai && $pegawai->getRoleAttribute() == 'Owner'){
            return $next($request);
        }
        return response()->json([
            'message' => 'Unauthorized',
        ], 401);
    }
}
