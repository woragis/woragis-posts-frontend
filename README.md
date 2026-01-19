# Posts Frontend Integration

Complete SvelteKit frontend integration for the Posts microservice. Provides a full-featured user interface for managing blog posts, case studies, problem solutions, technical writings, system designs, reports, impact metrics, and AI/ML integrations.

## Features

- ✅ User authentication (login, register, password reset)
- ✅ Profile management
- ✅ Posts management with full CRUD operations
- ✅ Support for 8 content domains (posts, case-studies, problem-solutions, technical-writings, system-designs, reports, impact-metrics, aiml-integrations)
- ✅ Responsive design with Tailwind CSS
- ✅ Type-safe API integration with TypeScript
- ✅ Axios-based HTTP client with token management
- ✅ Svelte stores for authentication state

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

See [QUICK_START.md](./QUICK_START.md) for detailed setup instructions.

## Project Structure

```
src/
  ├── lib/
  │   ├── api/              # API clients and utilities
  │   ├── stores/           # Svelte stores (auth)
  │   └── index.ts          # Central exports
  └── routes/               # SvelteKit pages and layout
.env                         # Environment configuration
```

## Documentation

- [QUICK_START.md](./QUICK_START.md) - Getting started guide
- [ENVIRONMENT.md](./ENVIRONMENT.md) - Configuration and environment setup
- [API_INTEGRATION.md](./API_INTEGRATION.md) - API client architecture and usage
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Authentication system and token management
- [SVELTEKIT_SETUP.md](./SVELTEKIT_SETUP.md) - Framework and dependencies
- [DOMAINS.md](./DOMAINS.md) - Content domains overview
- [COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md) - Component structure and patterns

## Development Commands

```bash
# Development
npm run dev          # Start dev server with hot reload

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run check        # Type checking
npm run lint         # Linting and formatting
npm run format       # Auto-format code

# Testing
npm run test         # Run all tests
npm run test:unit    # Unit tests only
npm run test:e2e     # E2E tests only
```

## Technology Stack

- **Framework**: SvelteKit 2.49.1
- **UI Framework**: Svelte 5.45.6
- **Styling**: Tailwind CSS 4.1.17
- **HTTP Client**: Axios 1.7.7
- **Build Tool**: Vite 7.2.6
- **Language**: TypeScript 5.9.3
- **Testing**: Vitest + Playwright

## API Integration

The frontend connects to:

- **Posts Service** (port 3013) - Main content management API
- **Auth Service** (port 3010) - User authentication

All requests are automatically authenticated with JWT tokens stored in secure cookies.

## Content Domains

1. **Posts** - General blog posts and articles
2. **Problem Solutions** - Q&A and troubleshooting
3. **Case Studies** - Project portfolios and success stories
4. **Technical Writings** - In-depth technical articles
5. **System Designs** - Architecture and design patterns
6. **Reports** - Analysis and periodic summaries
7. **Impact Metrics** - Performance tracking and measurement
8. **AI/ML Integrations** - AI-powered content features

## Authentication

The application includes a complete authentication system:

- User registration and login
- JWT token-based authentication
- Automatic token refresh
- Secure token storage in HttpOnly cookies
- Protected routes and pages

## Getting Help

- Check the [QUICK_START.md](./QUICK_START.md) for common setup issues
- Review [API_INTEGRATION.md](./API_INTEGRATION.md) for API usage examples
- See [COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md) for development patterns

## License

Proprietary - All rights reserved

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
