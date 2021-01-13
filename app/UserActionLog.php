<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserActionLog extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'action'
    ];

    public function user()
    {
        return $this->belongsTo('App\User');
    }
    public function book()
    {
        return $this->belongsTo('App\Book');
    }
}
