<?php

namespace App\Http\Controllers;

use App\Http\Requests\RequestOtpRequest;
use App\Http\Requests\VerifyOtpRequest;
use App\Models\User;
use App\Services\OtpService;
use App\Services\SmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OtpAuthController extends Controller
{
    public function __construct(
        protected OtpService $otpService,
        protected SmsService $smsService
    ) {}

    /**
     * Request an OTP code.
     */
    public function requestOtp(RequestOtpRequest $request): JsonResponse
    {
        $user = User::where('phone_number', $request->phone_number)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found with this phone number',
            ], 404);
        }

        if ($user->status === 'suspended') {
            return response()->json([
                'message' => 'Your account has been suspended',
            ], 403);
        }

        // Invalidate any existing active OTPs
        $this->otpService->invalidateActiveOtps($user);

        // Generate and create new OTP
        $plainCode = $this->otpService->generateCode();
        $result = $this->otpService->createOtp($user, $plainCode);

        // Send OTP via SMS
        $smsSent = $this->smsService->sendOtp($user->phone_number, $plainCode);

        return response()->json([
            'message' => 'OTP sent successfully',
            'sms_sent' => $smsSent,
        ]);
    }

    /**
     * Verify an OTP code and issue a token.
     */
    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $user = User::where('phone_number', $request->phone_number)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        if ($user->status === 'suspended') {
            return response()->json([
                'message' => 'Your account has been suspended',
            ], 403);
        }

        $otp = $this->otpService->verifyOtp($user, $request->otp);

        if (!$otp) {
            return response()->json([
                'message' => 'Invalid or expired OTP',
            ], 401);
        }

        // Mark OTP as used
        $otp->markAsUsed();

        // Create Sanctum token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ]);
    }

    /**
     * Logout and revoke the current token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
