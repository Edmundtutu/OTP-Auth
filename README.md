# OTP-Auth

A typical DIY authentication program using OTP verification. 

## What it is!

Phone-based authentication with OTP codes. No passwords, no fuss. 

## Backbone

- **Laravel API** - Modified users table + new OTPs table
- **webhook. site** - For SMS testing
- **Full control** - No over-reliance on SMS/OTP providers (Twilio, Africa's Talking, etc.)

## Structure

- **core/** - Backend logic (Laravel API)
- **sample/** - React UI for demo
- **Documentation** - You're reading it

## Features

- Phone number authentication
- Secure OTP handling (hashed, expiring, one-time use)
- Rate limiting (3 requests/min per phone)
- Bulk user import (CSV/Excel)
- Clean React UI
- Token-based auth (Laravel Sanctum)

## Quick Start

### Backend Setup

```bash
cd core
composer install
cp .env.example .env
php artisan key:generate

# Edit .env with your database credentials
php artisan migrate
php artisan serve
# API runs at http://localhost:8000
```

### Frontend Setup

```bash
cd sample
npm install
cp .env.example .env
npm run dev
# UI runs at http://localhost:5173
```

## How It Works

1. User enters phone number
2. OTP sent via webhook
3. User verifies OTP
4. Token issued, user authenticated

## API Endpoints

### Request OTP
```http
POST /api/auth/request-otp
Content-Type:  application/json

{
  "phone_number": "+256701234567"
}
```

### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type:  application/json

{
  "phone_number": "+256701234567",
  "otp":  "123456"
}
```

### Get User Info
```http
GET /api/me
Authorization: Bearer {token}
```

### Create User
```http
POST /api/users
Content-Type: application/json

{
  "phone_number": "+256701234567",
  "name": "John Doe"
}
```

### Bulk Import
```http
POST /api/users/bulk
Content-Type: multipart/form-data

file: users.csv
```

**CSV Format:**
```csv
phone_number,name
+256701234567,John Doe
+256701234568,Jane Smith
```

## Testing

1. Create a test user
2. Request OTP
3. Check webhook logs for code
4. Verify OTP
5. Access protected routes with token

Frontend:  Open http://localhost:5173 and follow the flow.

## Database

**Users Table**:  id, phone_number (unique), name, status, created_at

**OTPs Table**: id, user_id, code (hashed), expires_at, used_at

## Config

**Backend (. env):**
```env
DB_CONNECTION=mysql
DB_DATABASE=otp_auth
DB_USERNAME=root
DB_PASSWORD=

SMS_WEBHOOK_URL=https://your-webhook-url.com
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:8000
```

## Tech Stack

**Backend:** Laravel, MySQL, Sanctum

**Frontend:** React, TypeScript, Tailwind CSS, shadcn/ui

If u take any intrest in it, make it start your auth scafold...
...FOR LARAVEL LOVERS ONLY...
