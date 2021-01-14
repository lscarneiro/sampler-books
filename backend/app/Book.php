<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 *
 * @OA\Schema(
 *      @OA\Xml(name="Book"),
 *      @OA\Property(property="id", type="integer", readOnly="true", example="1"),
 *      @OA\Property(property="title", type="string", maxLength=255, example="Harry Potter and the Philosopher's Stone"),
 *      @OA\Property(property="isbn", type="string", maxLength=10, example="1408855895"),
 *      @OA\Property(property="published_at", type="date", example="2014-01-22"),
 *      @OA\Property(property="status", type="string", enum={"CHECKED_OUT", "AVAILABLE"}, example="AVAILABLE")
 * )
 *
 * Class Book
 *
 */
class Book extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'isbn', 'published_at', 'status'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'updated_at', 'created_at', 'borrower_id'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'published_at' => 'date:Y-m-d',
    ];

    public function isAvailable()
    {
        return $this->status === 'AVAILABLE';
    }
}
