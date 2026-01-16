# Authentication System

## Overview

The frontend implements a complete authentication system with:
- User registration and login
- JWT token-based authentication
- Automatic token refresh
- Secure token storage
- Session management

## Components

### AuthApiClient (`src/lib/api/auth/client.ts`)

Main authentication client handling all auth operations:

```typescript
// Login
const response = await authClient.login({ email, password });
// Returns: AuthResponse { accessToken, refreshToken, user, expiresIn }

// Register
const response = await authClient.register({
  email, password, firstName, lastName
});

// Get current user
const user = await authClient.getCurrentUser();

// Update profile
const user = await authClient.updateProfile({
  firstName, lastName, profilePicture
});

// Change password
await authClient.changePassword({ oldPassword, newPassword });

// Logout
await authClient.logout();

// Check authentication
const isAuth = authClient.isAuthenticated();
```

### Token Management (`src/lib/api/auth/cookies.ts`)

Secure cookie-based token storage:

```typescript
// Get tokens
const accessToken = tokenCookies.getAccessToken();
const refreshToken = tokenCookies.getRefreshToken();

// Set tokens
tokenCookies.setAccessToken(token);
tokenCookies.setRefreshToken(token);

// Clear tokens
tokenCookies.clearTokens();
```

Features:
- Uses `document.cookie` API
- Secure HttpOnly cookies (server-side)
- Automatic expiration handling

### Authentication Store (`src/lib/stores/auth.ts`)

Svelte store for reactive auth state:

```typescript
import { auth, loginUser, registerUser, logoutUser } from '$lib';

// Subscribe to auth state
$auth.user         // Current user
$auth.isAuthenticated // Boolean
$auth.isLoading    // Loading state
$auth.error        // Error message

// Perform actions
await loginUser(email, password);
await registerUser({ email, password, firstName, lastName });
await logoutUser();
await updateProfile({ firstName, lastName });
await changePassword(oldPassword, newPassword);
```

## Flow Diagram

```
Login Page
  ↓
loginUser(email, password)
  ↓
authClient.login()
  ↓
POST /auth/login
  ↓
Store tokens in cookies
  ↓
Update auth store
  ↓
Redirect to /dashboard
```

## Protected Routes

All authenticated routes check `$auth.isAuthenticated` in `onMount`:

```svelte
<script lang="ts">
  onMount(async () => {
    if (!$auth.isAuthenticated) {
      await goto('/auth/login');
    }
  });
</script>
```

## Token Refresh

Automatic token refresh on 401 response:

1. API returns 401 Unauthorized
2. Request interceptor detects 401
3. Automatically calls `authClient.refreshAccessToken()`
4. Retries original request with new token
5. If refresh fails, redirects to login

## Session Initialization

Run on app startup:

```typescript
import { initializeAuth } from '$lib';

onMount(async () => {
  await initializeAuth();
  // Checks if user has valid token
  // Loads user profile if authenticated
});
```

## Security Considerations

1. **HttpOnly Cookies** - Tokens stored in HttpOnly cookies, preventing XSS attacks
2. **CSRF Protection** - Use SameSite and CSRF tokens from backend
3. **Token Expiration** - Access tokens expire quickly, refresh tokens for long sessions
4. **Secure Transport** - Always use HTTPS in production
5. **Password Handling** - Never store passwords, only pass to auth service

## Types

```typescript
interface User {
  id: string;
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
```

## Pages

- **Login** - `/auth/login` - User login form
- **Register** - `/auth/register` - New account creation
- **Profile** - `/auth/profile` - User profile and settings
- **Dashboard** - `/dashboard` - Main authenticated page (requires login)
