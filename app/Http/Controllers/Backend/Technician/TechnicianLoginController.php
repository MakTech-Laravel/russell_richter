<?php

namespace App\Http\Controllers\Backend\Technician;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TechnicianLoginController extends Controller
{
    public function showLoginForm(): Response
    {
        return Inertia::render('backend/Technician/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::guard('technician')->attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => 'These credentials do not match our records.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('technician.jobs.index'));
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('technician')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('technician.login');
    }
}
