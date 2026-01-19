# API Configuration

Environment variables for connecting to backend services:

```env
PUBLIC_POSTS_API_URL=http://localhost:3013
PUBLIC_AUTH_API_URL=http://localhost:3010
```

## Backend Services

- **Posts Service**: Port 3013
  - Manages all posts-related content domains
  - Requires authentication from Auth Service

- **Auth Service**: Port 3010
  - Handles user authentication
  - Issues JWT tokens for API access

## Configuration Files

### .env

Stores environment-specific variables:

- API base URLs
- Can be overridden by system environment variables

### src/lib/config.ts

Runtime configuration that reads from .env and exposes typed constants.

## Development

For local development, ensure both services are running:

```bash
# Auth service (port 3010)
cd ../../backend/auth && npm run dev

# Posts service (port 3013)
cd ../../backend/posts && npm run dev

# Frontend (port 3000)
npm run dev
```

## Production

Update environment variables in deployment environment to point to production URLs.
