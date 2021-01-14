<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Book;
use App\Exceptions\UncompletedAction;
use App\Rules\Isbn;
use App\UserActionLog;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

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
     *                  type="object",
     *                  @OA\Property(
     *                      property="isbn",
     *                      type="array",
     *                      @OA\Items(type="string", example="Must be a valid ISBN-10.")
     *                  ),
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
            return Book::where('title', 'ILIKE', '%' . $fields['title'] . '%')->get();
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
     *                  type="object",
     *                  @OA\Property(
     *                      property="isbn",
     *                      type="array",
     *                      @OA\Items(type="string", example="Must be a valid ISBN-10.")
     *                  ),
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

    /**
     * Checkout book
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * @OA\Post(
     *      description="Checks out a book.",
     *      path="/api/books/{bookId}/checkout",
     *      tags={"Books"},
     *      security={{"access_token":{}}},
     *
     *      @OA\Parameter(
     *          name="bookId",
     *          in="path",
     *          description="ID of book",
     *          required=true,
     *          @OA\Schema(
     *              type="integer",
     *              format="int64",
     *              maximum=10,
     *              minimum=1
     *          )
     *      ),
     *
     *      @OA\Response(
     *          response="200",
     *          description="Book successfully checked out.",
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="message",
     *                  type="string",
     *                  example="Book checkout successful, enjoy your reading!"
     *              ),
     *          )
     *      ),
     *      @OA\Response(response="401", description="Unauthenticated"),
     *      @OA\Response(response="422", description="Unprocessable Entity",
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="message",
     *                  type="string",
     *                  example="Action could be completed."
     *              ),
     *              @OA\Property(
     *                  property="errors",
     *                  type="object",
     *                  @OA\Property(
     *                      property="checked_out",
     *                      type="string", example="Book is not available to checkout."
     *                  ),
     *              )
     *          )
     *      )
     * )
     */
    public function checkout($id)
    {
        $book = Book::findOrFail($id);

        if (!$book->isAvailable()) {
            throw new UncompletedAction(["checked_out" => "Book is not available to checkout."]);
        }
        \DB::transaction(function () use ($book) {
            $user_id = auth()->user()->id;

            $book->status = "CHECKED_OUT";
            $book->borrower_id = $user_id;
            $book->save();

            $userLog = new UserActionLog(['action' => 'CHECKOUT']);
            $userLog->user_id = $user_id;
            $userLog->book_id = $book->id;
            $userLog->save();
        });

        return response()->json([
            "message" => "Book checkout successful, enjoy your reading!"
        ]);
    }

    /**
     * Checkin book
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * @OA\Post(
     *      description="Checks in a book.",
     *      path="/api/books/{bookId}/checkin",
     *      tags={"Books"},
     *      security={{"access_token":{}}},
     *
     *      @OA\Parameter(
     *          name="bookId",
     *          in="path",
     *          description="ID of book",
     *          required=true,
     *          @OA\Schema(
     *              type="integer",
     *              format="int64",
     *              maximum=10,
     *              minimum=1
     *          )
     *      ),
     *
     *      @OA\Response(
     *          response="200",
     *          description="Book successfully checked in.",
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="message",
     *                  type="string",
     *                  example="Book checkin successful, combe back later!"
     *              ),
     *          )
     *      ),
     *      @OA\Response(response="401", description="Unauthenticated"),
     *      @OA\Response(response="422", description="Unprocessable Entity",
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="message",
     *                  type="string",
     *                  example="Action could be completed."
     *              ),
     *              @OA\Property(
     *                  property="errors",
     *                  type="object",
     *                  @OA\Property(
     *                      property="already_available",
     *                      type="string", example="Book is already available."
     *                  ),
     *              )
     *          )
     *      )
     * )
     */
    public function checkin($id)
    {
        $book = Book::findOrFail($id);

        if ($book->isAvailable()) {
            throw new UncompletedAction(["already_available" => "Book is already available."]);
        }
        $user_id = auth()->user()->id;

        $lastLog = UserActionLog::where('user_id', $user_id)
            ->where('book_id', $id)
            ->orderBy('id', 'desc')
            ->first();

        if (!isset($lastLog)) {
            throw new NotFoundHttpException();
        }
        if ($lastLog->action === 'CHECKIN') {
            throw new UncompletedAction(["already_available" => "Book is already available."]);
        }

        \DB::transaction(function () use ($book, $user_id) {
            $book->status = "AVAILABLE";
            $book->borrower_id = null;
            $book->save();

            $userLog = new UserActionLog(['action' => 'CHECKIN']);
            $userLog->user_id = auth()->user()->id;
            $userLog->book_id = $book->id;
            $userLog->save();
        });

        return response()->json([
            "message" => "Book checkin successful, combe back later!"
        ]);
    }
}
