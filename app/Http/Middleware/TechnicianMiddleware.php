<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TechnicianMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::guard('technician')->check()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            return redirect()->route('technician.login')->with('error', 'Please log in as a technician.');
        }

        $technician = Auth::guard('technician')->user();

        if (! $technician->is_active) {
            Auth::guard('technician')->logout();

            return redirect()->route('technician.login')->with('error', 'Your technician account is inactive.');
        }

        return $next($request);
    }
}
