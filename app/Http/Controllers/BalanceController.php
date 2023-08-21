<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class BalanceController extends Controller
{
    public function update(Request $request)
    {
        $user = User::find(Auth::id());
        $user->balance += $request->amount;
        $user-> save();
        return redirect()->back();
    }
}
