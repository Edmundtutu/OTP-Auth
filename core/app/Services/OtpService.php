<?php

namespace App\Services;

use App\Models\Otp;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class OtpService
{
    /**
     * Generate a 6-digit OTP code.
     */
    public function generateCode(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Create an OTP for a user with a hashed code.
     * 
     * @return array ['otp' => Otp, 'plainCode' => string]
     */
    public function createOtp(User $user, string $plainCode): array
    {
        $otp = Otp::create([
            'user_id' => $user->id,
            'code' => Hash::make($plainCode),
            'expires_at' => now()->addMinutes(5),
            'type' => 'login',
        ]);

        return [
            'otp' => $otp,
            'plainCode' => $plainCode,
        ];
    }

    /**
     * Verify an OTP code for a user.
     */
    public function verifyOtp(User $user, string $code): ?Otp
    {
        $otp = $user->otps()
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$otp || !Hash::check($code, $otp->code)) {
            return null;
        }

        return $otp;
    }

    /**
     * Invalidate all active OTPs for a user.
     */
    public function invalidateActiveOtps(User $user): void
    {
        $user->otps()
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->update(['used_at' => now()]);
    }
}
