<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Book;

class UserController extends Controller
{

    /**
     * Get the authenticated User data.
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * @OA\Get(
     *      path="/api/user",
     *      tags={"User"},
     *      security={{"access_token":{}}},
     *      @OA\Response(
     *          response="200",
     *          description="The user saved data",
     *          @OA\JsonContent(ref="#/components/schemas/User"),
     *      ),
     *      @OA\Response(response="401", description="Unauthenticated")
     * )
     */
    public function me()
    {
        return response()->json(auth('api')->user());
    }

    /**
     * Get user's borrowed books
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * @OA\Get(
     *      description="Retrieve the list of books atributed to the user.",
     *      path="/api/user/books",
     *      tags={"User"},
     *      security={{"access_token":{}}},
     *
     *      @OA\Response(
     *          response="200",
     *          description="Book list.",
     *          @OA\JsonContent(type="array",
     *              @OA\Items(ref="#/components/schemas/Book")
     *          )
     *      ),
     *      @OA\Response(response="401", description="Unauthenticated"),
     * )
     */
    public function userBooks(Request $request)
    {
        $user_id = auth()->user()->id;
        $books =  Book::where('borrower_id', $user_id)
            ->where('status', 'CHECKED_OUT')
            ->get();
        return response()->json($books);
    }
}
