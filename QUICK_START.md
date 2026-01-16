# Quick Start Guide

## Prerequisites

- Node.js 18+
- npm or pnpm
- Posts backend running on localhost:3013
- Auth service running on localhost:3010

## Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173` (or similar).

## First Run

1. Navigate to `http://localhost:5173`
2. You'll be redirected to login page if not authenticated
3. Click "Create account" to register new user
4. Fill in registration form with:
   - First name
   - Last name
   - Email
   - Password

5. After registration, you'll be logged in automatically
6. You'll see the dashboard with links to all content sections

## Development Workflow

### Running the Dev Server

```bash
npm run dev
```

Hot reload is enabled by default. Changes to files are reflected instantly.

### Type Checking

```bash
npm run check
```

Run this before committing to ensure no type errors.

### Code Formatting

```bash
npm run format
```

Auto-formats all code according to Prettier rules.

### Linting

```bash
npm run lint
```

Checks code quality and formatting.

## Project Structure

```
frontend/
├── src/
│   ├── lib/
│   │   ├── api/           # API clients and utilities
│   │   ├── stores/        # Svelte stores
│   │   ├── assets/        # Static assets
│   │   └── index.ts       # Central exports
│   ├── routes/            # SvelteKit routes
│   └── app.html           # HTML template
├── .env                   # Environment variables
├── package.json
├── tsconfig.json
├── svelte.config.js
└── vite.config.ts
```

## Environment Variables

Edit `.env` to configure backend URLs:

```env
PUBLIC_POSTS_API_URL=http://localhost:3013
PUBLIC_AUTH_API_URL=http://localhost:3010
```

## Testing

### Unit Tests

```bash
npm run test:unit
```

### E2E Tests

```bash
npm run test:e2e
```

### All Tests

```bash
npm run test
```

## Building for Production

```bash
npm run build
```

Creates optimized production bundle in `build/` directory.

## Common Tasks

### Add a New Page

1. Create `src/routes/[section]/+page.svelte`
2. Add link in navigation (`src/routes/+layout.svelte`)
3. Use API clients from `$lib`

### Add a New API Client

1. Create `src/lib/api/[domain]/client.ts`
2. Create `src/lib/api/[domain]/index.ts` export
3. Export from `src/lib/index.ts`
4. Add types to `src/lib/api/types.ts`

### Update Authentication

Edit `src/lib/stores/auth.ts` or `src/lib/api/auth/client.ts`

### Modify Styling

- Use Tailwind CSS classes in components
- Global styles in `src/routes/layout.css`
- Component-scoped styles in `<style>` blocks

## Troubleshooting

### Port Already in Use

Change the port in `vite.config.ts`:

```typescript
export default {
  server: {
    port: 3000  // Change to different port
  }
};
```

### CORS Errors

Ensure backend is running and CORS is configured to allow `http://localhost:5173`.

### Type Errors

Run `npm run check` to see all type issues and fix them.

### Module Not Found

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. ✅ Installation complete
2. Create your first posts
3. Organize with categories and tags
4. Write technical content
5. Track impact metrics
6. Share insights with teams
