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
     *      security={{"access_token":{}}},
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
     *          description="Mathing books.",
     *          @OA\JsonContent(type="array",
     *              @OA\Items(ref="#/components/schemas/Book")
     *          )
     *      ),
     *      @OA\Response(response="401", description="Unauthenticated"),
     *      @OA\Response(response="422", description="Unprocessable Entity",
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="message",
     *                  type="string",
     *                  example="The given data was invalid."
     *              ),
     *              @OA\Property(
     *                  property="errors",
     *                  type="array",
     *                  @OA\Items(
     *                      @OA\Property(
     *                          property="isbn",
     *                          type="array",
     *                          @OA\Items(type="string", example="Must be a valid ISBN-10.")
     *                      ),
     *                  )
     *              )
     *          )
     *      )
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

    /**
     * Create book
     *
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Post(
     *      description="Adds a new book to the library.",
     *      path="/api/books",
     *      tags={"Books"},
     *      security={{"access_token":{}}},
     * 
     *      @OA\RequestBody(
     *          @OA\MediaType(mediaType="application/json",
     *              @OA\Schema(
     *                  @OA\Property(property="id", type="integer", readOnly="true", example="1"),
     *                  @OA\Property(property="title", type="string", maxLength=255, example="Harry Potter and the Philosopher's Stone"),
     *                  @OA\Property(property="isbn", type="string", maxLength=10, example="1408855895"),
     *                  @OA\Property(property="published_at", type="date", example="2014-01-22"),
     *              )
     *          )
     *      ),
     * 
     *      @OA\Response(
     *          response="200", 
     *          description="The book data.",
     *          @OA\JsonContent(ref="#/components/schemas/Book")
     *      ),
     *      @OA\Response(response="401", description="Unauthenticated"),
     *      @OA\Response(response="422", description="Unprocessable Entity",
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="message",
     *                  type="string",
     *                  example="The given data was invalid."
     *              ),
     *              @OA\Property(
     *                  property="errors",
     *                  type="array",
     *                  @OA\Items(
     *                      @OA\Property(
     *                          property="isbn",
     *                          type="array",
     *                          @OA\Items(type="string", example="Must be a valid ISBN-10.")
     *                      ),
     *                  )
     *              )
     *          )
     *      )
     * )
     */
    public function create(Request $request)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'isbn' => ['required', 'string', new Isbn, 'unique:books'],
            'published_at' => ['required', 'date_format:Y-m-d'],
        ]);
        $book = new Book();
        $book->fill($request->input());
        $book->status = 'AVAILABLE'; // default status
        $book->save();

        return response()->json($book);
    }
}
