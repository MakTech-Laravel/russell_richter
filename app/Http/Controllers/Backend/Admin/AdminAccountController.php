<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAdminAccountRequest;
use App\Http\Requests\Admin\UpdateAdminPasswordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminAccountController extends Controller
{
    public function edit(): Response
    {
        $admin = Auth::guard('admin')->user();

        return Inertia::render('backend/Admin/Account/Edit', [
            'admin' => [
                'name' => $admin->name,
                'email' => $admin->email,
            ],
        ]);
    }

    public function update(UpdateAdminAccountRequest $request): RedirectResponse
    {
        Auth::guard('admin')->user()->update($request->validated());

        return back()->with('success', 'Account updated successfully.');
    }

    public function updatePassword(UpdateAdminPasswordRequest $request): RedirectResponse
    {
        Auth::guard('admin')->user()->update([
            'password' => $request->validated('password'),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }
}
