# SvelteKit Setup

## Framework

- **SvelteKit** v2.49.1
- **Svelte** v5.45.6
- **Vite** v7.2.6
- **TypeScript** v5.9.3

## Styling

- **Tailwind CSS** v4.1.17
- **@tailwindcss/forms** - Form styling
- **@tailwindcss/typography** - Prose styling
- **prettier-plugin-tailwindcss** - Automatic class sorting

## Testing

- **Vitest** v4.0.15 - Unit tests
- **Playwright** v1.57.0 - E2E tests
- **@playwright/test** - Playwright testing framework

## Code Quality

- **ESLint** v9.39.1 - Linting
- **Prettier** v3.7.4 - Code formatting
- **svelte-check** v4.3.4 - Svelte type checking
- **typescript-eslint** v8.48.1 - TypeScript linting

## HTTP Client

- **Axios** v1.7.7 - HTTP requests with interceptors

## Adapter

- **@sveltejs/adapter-auto** - Auto-selects best adapter

## Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run check        # Run svelte-check and TypeScript check
npm run check:watch  # Watch mode for checks
npm run lint         # Check linting and formatting
npm run format       # Auto-format code

# Testing
npm run test:unit    # Run unit tests
npm run test:e2e     # Run E2E tests
npm run test         # Run all tests
```

## Configuration Files

- `svelte.config.js` - SvelteKit configuration
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `eslint.config.js` - ESLint rules
- `.prettierrc` - Prettier formatting

## Adapter

Uses `@sveltejs/adapter-auto` which automatically detects the best deployment target:
- Node.js
- Vercel
- Cloudflare
- Netlify
- AWS Lambda
- etc.

## Alias

The `$lib` alias resolves to `src/lib`:
```typescript
import { auth } from '$lib';  // src/lib/index.ts
import { postsClient } from '$lib/api/posts';
```

## Advanced Features Used

- **+page.svelte** - Route-specific components
- **+layout.svelte** - Layout hierarchy
- **$page** store - Access route parameters
- **+page.ts** - Page load data
- **Svelte Stores** - Global state management
- **Runes** - Let bindings with new Svelte 5 syntax
