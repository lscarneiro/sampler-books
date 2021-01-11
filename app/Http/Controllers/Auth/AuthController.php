<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;


class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
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

        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
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
     *      @OA\Response(response="401", description="Unauthorized")
     * )
     */
    public function me()
    {
        return response()->json(auth('api')->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
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
