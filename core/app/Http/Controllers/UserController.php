<?php

namespace App\Http\Controllers;

use App\Http\Requests\BulkImportRequest;
use App\Http\Requests\CreateUserRequest;
use App\Models\User;
use App\Rules\UserValidationRules;
use Illuminate\Http\JsonResponse;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Create a single user.
     */
    public function store(CreateUserRequest $request): JsonResponse
    {
        $user = User::create([
            'phone_number' => $request->phone_number,
            'name' => $request->name,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
        ], 201);
    }

    /**
     * Bulk import users from CSV/Excel file.
     */
    public function bulkImport(BulkImportRequest $request): JsonResponse
    {
        $file = $request->file('file');
        $data = Excel::toArray([], $file)[0];

        if (empty($data)) {
            return response()->json([
                'message' => 'The file is empty',
            ], 422);
        }

        // Remove header row if present
        $header = array_shift($data);

        $imported = 0;
        $failed = 0;
        $errors = [];

        foreach ($data as $index => $row) {
            $rowNumber = $index + 2; // +2 because we removed header and arrays are 0-indexed

            // Map row data
            $userData = [
                'phone_number' => $row[0] ?? null,
                'name' => $row[1] ?? null,
            ];

            // Validate row using shared validation rules
            $validator = Validator::make($userData, UserValidationRules::rules(), UserValidationRules::messages());

            if ($validator->fails()) {
                $failed++;
                $errors[] = [
                    'row' => $rowNumber,
                    'errors' => $validator->errors()->toArray(),
                ];
                continue;
            }

            // Create user
            try {
                User::create([
                    'phone_number' => $userData['phone_number'],
                    'name' => $userData['name'],
                    'status' => 'active',
                ]);
                $imported++;
            } catch (\Exception $e) {
                $failed++;
                $errors[] = [
                    'row' => $rowNumber,
                    'errors' => ['general' => [$e->getMessage()]],
                ];
            }
        }

        return response()->json([
            'message' => 'Import completed',
            'imported' => $imported,
            'failed' => $failed,
            'errors' => $errors,
        ], $failed > 0 ? 207 : 201);
    }
}
