<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlackjackController extends Controller
{
    public function play(): Response
    {
        return inertia::render('Games/Blackjack/Blackjack');
    }
}
