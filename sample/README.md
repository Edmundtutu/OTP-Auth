# OTP Authentication Frontend

A modern React frontend for the OTP (One-Time Password) authentication system. Built with React, TypeScript, Vite, and shadcn/ui components.

## Features

- 📱 Phone number-based authentication
- 🔐 OTP verification (6-digit code)
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔒 Protected routes with authentication
- 💾 Token-based session management
- 🚀 Fast development with Vite
- 📦 Type-safe with TypeScript
- 🎯 Clean architecture with proper separation of concerns

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **input-otp** - OTP input component

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── input-otp.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   ├── useAuth.ts
│   └── use-toast.ts
├── lib/
│   ├── api.ts
│   ├── auth.service.ts
│   └── utils.ts
├── pages/
│   ├── Index.tsx
│   ├── PhoneInput.tsx
│   ├── VerifyOtp.tsx
│   └── Dashboard.tsx
├── App.tsx
└── main.tsx
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (default: http://localhost:8000)

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd sample
```

2. Install dependencies:
```sh
npm install
```

3. Configure environment variables:
```sh
cp .env.example .env
```

Edit `.env` and set your API URL:
```
VITE_API_BASE_URL=http://localhost:8000
```

4. Start the development server:
```sh
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## API Integration

The frontend connects to the Laravel backend API with the following endpoints:

### Authentication Flow

1. **Request OTP**
   - Endpoint: `POST /api/auth/request-otp`
   - Body: `{ phone_number: string }`
   - Response: `{ message: string }`

2. **Verify OTP**
   - Endpoint: `POST /api/auth/verify-otp`
   - Body: `{ phone_number: string, otp: string }`
   - Response: `{ token: string, user: User }`

3. **Get User Info**
   - Endpoint: `GET /api/me`
   - Headers: `Authorization: Bearer {token}`
   - Response: `User`

4. **Logout**
   - Endpoint: `POST /api/auth/logout`
   - Headers: `Authorization: Bearer {token}`

## Architecture

### Authentication Context

The `AuthContext` manages the authentication state globally:
- User information
- Authentication token
- Login/logout methods
- Token persistence in localStorage

### Protected Routes

Routes requiring authentication are wrapped with `ProtectedRoute`:
- Checks authentication status
- Redirects to login if not authenticated
- Shows loading state during verification

### API Service Layer

- **api.ts**: Axios configuration with interceptors
  - Attaches Bearer token to requests
  - Handles 401 errors (auto-logout)
  
- **auth.service.ts**: Authentication API methods
  - Request OTP
  - Verify OTP
  - Get user profile
  - Logout
  - Token management

## User Flow

1. **Landing** (`/`)
   - Redirects to `/phone-input` if not authenticated
   - Redirects to `/dashboard` if authenticated

2. **Phone Input** (`/phone-input`)
   - Enter phone number (must start with +)
   - Request OTP
   - Navigate to verification page

3. **OTP Verification** (`/verify-otp`)
   - Enter 6-digit OTP code
   - Verify OTP
   - Option to resend code
   - Option to change phone number
   - On success, navigate to dashboard

4. **Dashboard** (`/dashboard`) - Protected
   - Display user information
   - Logout functionality

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8000` |

## Building for Production

```sh
npm run build
```

This creates an optimized production build in the `dist/` directory.

To preview the production build:
```sh
npm run preview
```

## Deployment

The built static files can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any web server

Make sure to set the `VITE_API_BASE_URL` environment variable to your production API URL.

## Development Guidelines

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Wrap with `ProtectedRoute` if authentication required

### Adding New API Endpoints

1. Add method to `src/lib/auth.service.ts` or create new service
2. Use the configured `api` instance from `src/lib/api.ts`
3. Handle errors appropriately with toast notifications

### UI Components

- Use shadcn/ui components from `src/components/ui/`
- Follow Tailwind CSS conventions
- Maintain responsive design

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)


