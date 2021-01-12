<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Book;
use App\Rules\Isbn;

class BooksController extends Controller
{
    public function all()
    {
        return response()->json(Book::all());
    }

    /**
     * Search books
     *
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Post(
     *      description="Search by Title OR ISBN. If both are passed, ISBN will be used.",
     *      path="/api/books/search",
     *      tags={"Books"},
     * 
     *      @OA\RequestBody(
     *          @OA\MediaType(mediaType="application/json",
     *              @OA\Schema(
     *                  @OA\Property(
     *                      property="title",
     *                      type="string",
     *                      example="Harry Potter"
     *                  ),
     *                  @OA\Property(
     *                      property="isbn",
     *                      type="string",
     *                      example="1408855895"
     *                  ),
     *              )
     *          )
     *      ),
     * 
     *      @OA\Response(
     *          response="200", 
     *          description="A successfull book search.",
     *          @OA\JsonContent(type="array",
     *              @OA\Items(ref="#/components/schemas/Book")
     *          )
     *      ),
     *      @OA\Response(response="401", description="Unauthorized")
     * )
     */
    public function search(Request $request)
    {
        $request->validate([
            'title' => ['required_without:isbn', 'string'],
            'isbn' => ['required_without:title', 'string', new Isbn],
        ]);
        $fields = $request->input();
        if (isset($fields['isbn'])) {
            return Book::where('isbn', $fields['isbn'])->get();
        } else {
            return Book::where('title', 'LIKE', '%' . $fields['title'] . '%')->get();
        }
    }
}
