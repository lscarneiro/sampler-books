<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Rules\ValidPassword;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\User;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Register as new user.
     *
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Post(
     *      description="Register as new user",
     *      path="/api/auth/register",
     *      tags={"Auth"},
     * 
     *      @OA\RequestBody(
     *          @OA\MediaType(
     *              mediaType="application/json",
     *              @OA\Schema(
     *                  @OA\Property(
     *                      property="name",
     *                      type="string"
     *                  ),
     *                  @OA\Property(
     *                      property="email",
     *                      type="string"
     *                  ),
     *                  @OA\Property(
     *                      property="date_of_birth",
     *                      type="date"
     *                  ),
     *                  @OA\Property(
     *                      property="password",
     *                      type="string"
     *                  ),
     *                  example={
     *                      "name": "George Lucas", 
     *                      "email": "george@lucasarts.com", 
     *                      "date_of_birth": "1944-05-14", 
     *                      "password": "5T4r W4Rs"
     *                  }
     *              )
     *          )
     *      ),
     * 
     *      @OA\Response(
     *          response="200", 
     *          description="An acess_token response.",
     *          content={
     *              @OA\MediaType(
     *                  mediaType="application/json",
     *                  @OA\Schema(
     *                      @OA\Property(
     *                          property="access_token",
     *                          type="string",
     *                          description="JWT access token"
     *                      ),
     *                      @OA\Property(
     *                          property="token_type",
     *                          type="string",
     *                          description="Token type"
     *                      ),
     *                      @OA\Property(
     *                          property="expires_in",
     *                          type="integer",
     *                          description="Token expiration in seconds",
     *                          @OA\Items
     *                      ),
     *                      example={
     *                          "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
     *                          "token_type": "bearer",
     *                          "expires_in": 3600
     *                      }
     *                  )
     *              )
     *          }
     *      ),
     *      @OA\Response(response="401", description="Unauthorized"),
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
     *                          property="email",
     *                          type="array",
     *                          @OA\Items(type="string", example="The email must be a valid email address.")
     *                      ),
     *                      @OA\Property(
     *                          property="date_of_birth",
     *                          type="array",
     *                          @OA\Items(type="string", example="The date of birth is not a valid date.")
     *                      ),
     *                  )
     *              )
     *          )
     *      )
     * )
     */
    public function register()
    {
        request()->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => ['required', 'string', 'min:8', new ValidPassword],
            'date_of_birth' => 'required|date:Y-m-d',
        ]);

        $user = User::create(request()->input());
        $token = JWTAuth::fromUser($user);

        return $this->respondWithToken($token);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Post(
     *      description="Endpoint for log in",
     *      path="/api/auth/login",
     *      tags={"Auth"},
     *      @OA\RequestBody(
     *          @OA\MediaType(
     *              mediaType="application/json",
     *              @OA\Schema(
     *                  @OA\Property(
     *                      property="email",
     *                      type="string"
     *                  ),
     *                  @OA\Property(
     *                      property="password",
     *                      type="string"
     *                  ),
     *                  example={"email": "foo@foobar.com", "password": "P455w0Rd"}
     *              )
     *          )
     *      ),
     * 
     *      @OA\Response(
     *          response="200", 
     *          description="An acess_token response.",
     *          content={
     *              @OA\MediaType(
     *                  mediaType="application/json",
     *                  @OA\Schema(
     *                      @OA\Property(
     *                          property="access_token",
     *                          type="string",
     *                          description="JWT access token"
     *                      ),
     *                      @OA\Property(
     *                          property="token_type",
     *                          type="string",
     *                          description="Token type"
     *                      ),
     *                      @OA\Property(
     *                          property="expires_in",
     *                          type="integer",
     *                          description="Token expiration in seconds",
     *                          @OA\Items
     *                      ),
     *                      example={
     *                          "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
     *                          "token_type": "bearer",
     *                          "expires_in": 3600
     *                      }
     *                  )
     *              )
     *          }
     *      ),
     *      @OA\Response(response="401", description="Unauthorized")
     * )
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Post(
     *      description="Endpoint for log out. It invalidates the JWT",
     *      path="/api/auth/logout",
     *      tags={"Auth"},
     *      security={{"access_token":{}}},
     *      @OA\Response(
     *          response="200", 
     *          description="Successfully logged out",
     *          content={
     *              @OA\MediaType(
     *                  mediaType="application/json",
     *                  @OA\Schema(
     *                      @OA\Property(
     *                          property="message",
     *                          type="string",
     *                          description="JWT access token"
     *                      ),
     *                      example={
     *                          "message": "Successfully logged out"
     *                      }
     *                  )
     *              )
     *          }
     *      ),
     *      @OA\Response(response="401", description="Unauthenticated")
     * )
     */
    public function logout()
    {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Get(
     *      path="/api/auth/me",
     *      tags={"Auth"},
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
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     * 
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }
}
