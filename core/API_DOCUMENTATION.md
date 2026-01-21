# OTP Authentication API Documentation

This document provides comprehensive documentation for the OTP Authentication System API endpoints.

## Base URL
```
http://localhost:8000/api
```

## Authentication
Most protected endpoints require a Bearer token obtained from the OTP verification endpoint.

```
Authorization: Bearer {token}
```

---

## Public Endpoints

### 1. Request OTP
Request an OTP code to be sent via SMS.

**Endpoint:** `POST /auth/request-otp`

**Rate Limiting:** 3 requests per minute per phone number

**Request Body:**
```json
{
  "phone_number": "+256701234567"
}
```

**Success Response (200):**
```json
{
  "message": "OTP sent successfully",
  "sms_sent": true
}
```

**Error Responses:**

- **404 Not Found** - User not found
```json
{
  "message": "User not found with this phone number"
}
```

- **403 Forbidden** - Account suspended
```json
{
  "message": "Your account has been suspended"
}
```

- **429 Too Many Requests** - Rate limit exceeded
```json
{
  "message": "Too Many Attempts."
}
```

---

### 2. Verify OTP
Verify the OTP code and receive an authentication token.

**Endpoint:** `POST /auth/verify-otp`

**Request Body:**
```json
{
  "phone_number": "+256701234567",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "1|abcdefghijklmnopqrstuvwxyz...",
  "user": {
    "id": 1,
    "phone_number": "+256701234567",
    "name": "John Doe",
    "status": "active",
    "email": null,
    "created_at": "2024-01-21T12:00:00.000000Z",
    "updated_at": "2024-01-21T12:00:00.000000Z"
  }
}
```

**Error Responses:**

- **401 Unauthorized** - Invalid credentials or OTP
```json
{
  "message": "Invalid or expired OTP"
}
```

- **403 Forbidden** - Account suspended
```json
{
  "message": "Your account has been suspended"
}
```

---

## Admin Endpoints (Unprotected for Testing)

> **⚠️ IMPORTANT:** In production, these endpoints should be protected with proper authentication middleware.

### 3. Create User
Create a single user.

**Endpoint:** `POST /users`

**Request Body:**
```json
{
  "phone_number": "+256701234567",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "phone_number": "+256701234567",
    "name": "John Doe",
    "status": "active",
    "email": null,
    "created_at": "2024-01-21T12:00:00.000000Z",
    "updated_at": "2024-01-21T12:00:00.000000Z"
  }
}
```

**Validation Errors (422):**
```json
{
  "message": "The phone number has already been taken.",
  "errors": {
    "phone_number": [
      "The phone number has already been taken."
    ]
  }
}
```

---

### 4. Bulk Import Users
Import multiple users from CSV or Excel file.

**Endpoint:** `POST /users/bulk`

**Request:**
- Content-Type: `multipart/form-data`
- Field: `file` (CSV or XLSX)

**CSV Format:**
```csv
phone_number,name
+256701234567,John Doe
+256707654321,Jane Smith
+256703456789,Bob Johnson
```

**Success Response (201/207):**
```json
{
  "message": "Import completed",
  "imported": 3,
  "failed": 0,
  "errors": []
}
```

**Partial Success Response (207):**
```json
{
  "message": "Import completed",
  "imported": 2,
  "failed": 1,
  "errors": [
    {
      "row": 3,
      "errors": {
        "phone_number": [
          "The phone number has already been taken."
        ]
      }
    }
  ]
}
```

**Validation Errors (422):**
```json
{
  "message": "The file must be a CSV or Excel file.",
  "errors": {
    "file": [
      "The file must be a CSV or Excel file."
    ]
  }
}
```

---

## Protected Endpoints

### 5. Get Authenticated User
Get the currently authenticated user's information.

**Endpoint:** `GET /me`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "user": {
    "id": 1,
    "phone_number": "+256701234567",
    "name": "John Doe",
    "status": "active",
    "email": null,
    "created_at": "2024-01-21T12:00:00.000000Z",
    "updated_at": "2024-01-21T12:00:00.000000Z"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Unauthenticated."
}
```

---

### 6. Logout
Logout and revoke the current access token.

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Error Response (401):**
```json
{
  "message": "Unauthenticated."
}
```

---

## Testing with Postman

### Setup
1. Create a new Postman collection
2. Set base URL variable: `{{base_url}}` = `http://localhost:8000/api`

### Authentication Flow

1. **Create a test user:**
   ```
   POST {{base_url}}/users
   Body: {
     "phone_number": "+256701234567",
     "name": "Test User"
   }
   ```

2. **Request OTP:**
   ```
   POST {{base_url}}/auth/request-otp
   Body: {
     "phone_number": "+256701234567"
   }
   ```

3. **Check OTP in database or logs:**
   - Query the `otps` table to see the hashed OTP
   - Check application logs for the plain OTP code (in development)

4. **Verify OTP:**
   ```
   POST {{base_url}}/auth/verify-otp
   Body: {
     "phone_number": "+256701234567",
     "otp": "123456"
   }
   ```
   
5. **Save the token from response**

6. **Test protected endpoint:**
   ```
   GET {{base_url}}/me
   Headers: {
     "Authorization": "Bearer {your_token}"
   }
   ```

7. **Logout:**
   ```
   POST {{base_url}}/auth/logout
   Headers: {
     "Authorization": "Bearer {your_token}"
   }
   ```

---

## Environment Variables

Add these to your `.env` file:

```env
SMS_WEBHOOK_URL=https://your-sms-webhook.com/send
```

---

## Rate Limiting

The `/auth/request-otp` endpoint is rate-limited to **3 requests per minute per phone number**.

If you exceed this limit, you'll receive:
```json
{
  "message": "Too Many Attempts."
}
```

---

## Security Features

1. **OTP Hashing:** OTP codes are hashed using bcrypt before storage
2. **OTP Expiration:** OTPs expire after 5 minutes
3. **One-time Use:** OTPs can only be used once
4. **Rate Limiting:** Prevents OTP spam attacks
5. **Account Suspension:** Suspended accounts cannot request or verify OTPs
6. **Token Authentication:** Protected endpoints require valid Sanctum tokens

---

## Error Handling

All endpoints follow standard HTTP status codes:

- `200` - Success
- `201` - Created
- `207` - Multi-Status (partial success)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests

Error responses include a `message` field and may include an `errors` object for validation failures.
