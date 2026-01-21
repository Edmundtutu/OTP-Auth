# OTP Authentication System

A production-ready OTP (One-Time Password) authentication system built with Laravel (API backend) and React (frontend). This system uses phone numbers as the primary identity and implements secure OTP-based authentication without passwords.

## 🎯 Overview

This is a reference implementation demonstrating best-practice architecture for building OTP authentication systems suitable for fintech, telecom, and other applications requiring phone-based authentication.

### Key Features

- 📱 **Phone-based authentication** - No passwords, just OTP codes
- 🔐 **Secure OTP handling** - Hashed storage, expiry, one-time use
- 🚀 **Rate limiting** - 3 OTP requests per minute per phone
- 📊 **Bulk user import** - CSV/Excel support
- 🎨 **Modern UI** - React with shadcn/ui components
- 🔒 **Token-based auth** - Laravel Sanctum
- 📡 **Webhook SMS delivery** - Configurable SMS provider

## 📋 Architecture

### Backend (Laravel API)
```
core/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── OtpAuthController.php    # OTP authentication flow
│   │   │   ├── UserController.php       # User registration
│   │   │   └── MeController.php         # Protected user endpoint
│   │   └── Requests/                    # Form validation
│   ├── Models/
│   │   ├── User.php                     # User model (phone-based)
│   │   └── Otp.php                      # OTP model
│   └── Services/
│       ├── OtpService.php               # OTP generation & verification
│       └── SmsService.php               # SMS webhook integration
├── database/
│   └── migrations/
│       ├── create_users_table.php       # Users with phone_number
│       └── create_otps_table.php        # OTP storage
└── routes/
    └── api.php                          # API endpoints
```

### Frontend (React)
```
sample/
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx              # Global auth state
│   ├── hooks/
│   │   └── useAuth.ts                   # Auth hook
│   ├── lib/
│   │   ├── api.ts                       # Axios config
│   │   └── auth.service.ts              # Auth API calls
│   ├── components/
│   │   └── ProtectedRoute.tsx           # Route protection
│   └── pages/
│       ├── PhoneInput.tsx               # Enter phone number
│       ├── VerifyOtp.tsx                # Enter OTP code
│       ├── Dashboard.tsx                # Protected dashboard
│       └── Index.tsx                    # Landing page
```

## 🚀 Quick Start

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+ & npm
- MySQL/PostgreSQL
- Git

### Backend Setup

```bash
cd core

# Install dependencies
composer install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database configuration
# Edit .env and set your database credentials:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=otp_auth
# DB_USERNAME=root
# DB_PASSWORD=

# SMS Webhook configuration
# Edit .env and set your SMS webhook URL:
# SMS_WEBHOOK_URL=https://your-sms-provider.com/api/send

# Run migrations
php artisan migrate

# Start the server
php artisan serve
# API will be available at http://localhost:8000
```

### Frontend Setup

```bash
cd sample

# Install dependencies
npm install

# Environment setup
cp .env.example .env
# Edit .env if your API is not at http://localhost:8000
# VITE_API_BASE_URL=http://localhost:8000

# Start development server
npm run dev
# Frontend will be available at http://localhost:5173
```

## 📡 API Documentation

### Authentication Endpoints

#### Request OTP
```http
POST /api/auth/request-otp
Content-Type: application/json

{
  "phone_number": "+256701234567"
}
```

**Response:**
```json
{
  "status": "otp_sent",
  "message": "OTP sent successfully",
  "expires_in": 300
}
```

**Rate Limiting:** 3 requests per minute per phone number

---

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone_number": "+256701234567",
  "otp": "123456"
}
```

**Response:**
```json
{
  "token": "1|eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "phone_number": "+256701234567",
    "name": "John Doe",
    "status": "active"
  }
}
```

---

#### Get Authenticated User
```http
GET /api/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "phone_number": "+256701234567",
  "name": "John Doe",
  "status": "active",
  "created_at": "2026-01-21T00:00:00.000000Z"
}
```

---

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### User Management Endpoints

#### Create Single User
```http
POST /api/users
Content-Type: application/json

{
  "phone_number": "+256701234567",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "phone_number": "+256701234567",
    "name": "John Doe",
    "status": "active"
  }
}
```

---

#### Bulk Import Users
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
+256701234569,Bob Johnson
```

**Response:**
```json
{
  "message": "Import completed",
  "imported": 120,
  "skipped": 5,
  "errors": [
    {
      "row": 3,
      "phone": "+256701234569",
      "error": "Phone number already exists"
    }
  ]
}
```

## 🔐 Security Features

### OTP Security
- ✅ **Hashed storage** - OTP codes hashed with bcrypt
- ✅ **Time-limited** - 5-minute expiry
- ✅ **One-time use** - Marked as used after verification
- ✅ **Rate limiting** - 3 requests/minute per phone
- ✅ **Auto-invalidation** - Old OTPs invalidated when new one requested

### API Security
- ✅ **Sanctum tokens** - Secure API authentication
- ✅ **Bearer token** - Standard token format
- ✅ **Token revocation** - Logout support
- ✅ **Status checks** - Suspended accounts blocked
- ✅ **CORS configured** - Cross-origin request handling

### Data Protection
- ✅ **Phone validation** - International format required (+XXX...)
- ✅ **Unique phones** - No duplicate phone numbers
- ✅ **Input sanitization** - Form request validation
- ✅ **SQL injection protection** - Eloquent ORM

## 🧪 Testing

### Manual Testing with Postman

1. **Create a test user:**
   ```bash
   curl -X POST http://localhost:8000/api/users \
     -H "Content-Type: application/json" \
     -d '{"phone_number":"+256701234567","name":"Test User"}'
   ```

2. **Request OTP:**
   ```bash
   curl -X POST http://localhost:8000/api/auth/request-otp \
     -H "Content-Type: application/json" \
     -d '{"phone_number":"+256701234567"}'
   ```
   
   Check your SMS webhook logs for the OTP code

3. **Verify OTP and get token:**
   ```bash
   curl -X POST http://localhost:8000/api/auth/verify-otp \
     -H "Content-Type: application/json" \
     -d '{"phone_number":"+256701234567","otp":"123456"}'
   ```

4. **Access protected endpoint:**
   ```bash
   curl -X GET http://localhost:8000/api/me \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

### Frontend Testing

1. Open http://localhost:5173
2. Enter a phone number (use the one you created)
3. Click "Send Code"
4. Check SMS webhook for OTP
5. Enter the 6-digit OTP
6. Click "Verify"
7. You should be redirected to the dashboard

### Laravel Tests

```bash
cd core
php artisan test
```

## 📊 Database Schema

### Users Table
| Column | Type | Attributes |
|--------|------|------------|
| id | bigint | Primary Key |
| phone_number | varchar | Unique, Indexed |
| name | varchar | Nullable |
| status | enum | active/suspended |
| email | varchar | Nullable, Unique |
| password | varchar | Nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

### OTPs Table
| Column | Type | Attributes |
|--------|------|------------|
| id | bigint | Primary Key |
| user_id | bigint | Foreign Key (users.id) |
| code | varchar | Hashed |
| expires_at | timestamp | Indexed |
| type | enum | login |
| used_at | timestamp | Nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

## 🔧 Configuration

### Environment Variables (Backend)

```env
# Application
APP_URL=http://localhost
APP_ENV=local
APP_DEBUG=true

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=otp_auth
DB_USERNAME=root
DB_PASSWORD=

# SMS Webhook
SMS_WEBHOOK_URL=https://your-sms-provider.com/api/send

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:8000
SESSION_DOMAIN=localhost
```

### Environment Variables (Frontend)

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:8000
```

## 🎨 Frontend Features

### User Interface
- Clean, modern design with Tailwind CSS
- Responsive layout (mobile-friendly)
- Loading states for all operations
- Toast notifications for feedback
- Form validation with error messages

### User Experience
- Auto-focus on input fields
- 6-digit OTP input component
- Resend OTP option
- Change phone number option
- Auto-redirect after verification
- Persistent authentication (localStorage)

## 🚀 Production Deployment

### Backend

1. **Set production environment:**
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```

2. **Secure your database:**
   - Use strong credentials
   - Enable SSL connections
   - Regular backups

3. **Configure CORS properly:**
   - Update `config/cors.php` with your frontend domain
   - Update `SANCTUM_STATEFUL_DOMAINS` in .env

4. **Set up SMS webhook:**
   - Configure real SMS provider
   - Add webhook authentication if needed
   - Monitor webhook logs

5. **Enable HTTPS:**
   - Use SSL certificate
   - Update APP_URL to https://

6. **Optimize:**
   ```bash
   composer install --no-dev --optimize-autoloader
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

### Frontend

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy static files:**
   - Upload `dist/` folder to your hosting
   - Configure web server (nginx/Apache)
   - Enable gzip compression
   - Set up CDN if needed

3. **Update API URL:**
   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```

## 📝 License

MIT License - feel free to use this for your projects.

## 🤝 Contributing

This is a reference implementation. Feel free to fork and adapt for your needs.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using Laravel & React**
