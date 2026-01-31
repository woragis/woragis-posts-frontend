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

## AI-Assisted Draft Builder

This frontend includes an AI-powered draft builder that helps you create articles quickly!

### Creating Posts with AI

1. Navigate to **Posts > New Post**
2. Select the **"AI Draft Builder"** tab
3. Provide article context:
   - Topic and key points
   - Target audience
   - Tone (professional, friendly, etc.)
4. Choose an agent type or use "auto"
5. Adjust creativity with the temperature slider
6. Click **"Generate Draft"**
7. Wait for AI to stream the draft
8. Click **"Use This Draft"** to move to the editor

### Editing & Improving Posts

1. Navigate to **Posts > [Draft]** to edit an existing draft
2. Use the **"Show AI Improve"** button to access improvements
3. Describe what you want to improve:
   - "Make it more technical"
   - "Add examples and case studies"
   - "Simplify for beginners"
   - "Add statistics and data"
4. Click **"Improve with AI"**
5. Preview the improved content
6. Click **"Accept Changes"** to apply or regenerate

### Writing in Markdown

All posts are written in Markdown and rendered beautifully:

- **Bold**: `**text**`
- *Italic*: `*text*`
- `Code`: `` `code` ``
- Code blocks: ` ``` ` ... ` ``` `
- Headings: `# Heading 1`, `## Heading 2`, etc.
- Lists: `- item` or `1. numbered`
- Links: `[text](url)`

Use the **Preview** tab in the editor to see how your content will look.

### Saving & Publishing

- **Save as Draft**: Keep your post as a draft for later editing
- **Publish**: Make your post visible to readers immediately
- **Edit Later**: Click on any draft in the Posts list to continue editing

## Environment Configuration

Create a `.env` file in the `frontend` directory:

```env
PUBLIC_POSTS_API_URL=http://localhost:3013
PUBLIC_AUTH_API_URL=http://localhost:3010
PUBLIC_AI_SERVICE_URL=http://localhost:8000
```

The AI service URL is required for the draft builder to work. Ensure the AI service is running on port 8000.

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

### AI Draft Not Generating

1. Check that `PUBLIC_AI_SERVICE_URL` is set correctly in `.env`
2. Ensure the AI service is running: `http://localhost:8000/healthz`
3. Check browser console for network errors
4. Verify your network can reach the AI service

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
2. Generate your first draft with AI
3. Edit and improve with AI assistance
4. Publish your posts
5. Organize with categories and tags
6. Track impact metrics
