# Component Architecture

## Layout Components

### Root Layout (`src/routes/+layout.svelte`)

Main application layout with persistent navigation:

**Features:**

- Top navigation bar with logo
- User menu with profile/logout
- Responsive design
- Global error handling

**Includes:**

- Navigation links to all main sections
- User greeting with first/last name
- Profile and logout buttons
- Sticky header

## Page Components

### Authentication Pages

#### Login (`src/routes/auth/login/+page.svelte`)

User login form:

- Email input
- Password input
- Error display
- Link to registration
- Form validation

#### Register (`src/routes/auth/register/+page.svelte`)

User registration form:

- First name input
- Last name input
- Email input
- Password input
- Confirm password
- Email format validation
- Password match validation

#### Profile (`src/routes/auth/profile/+page.svelte`)

User profile management:

- View current user info
- Edit profile (name, picture)
- Change password
- Tabbed interface

### Main Pages

#### Home (`src/routes/+page.svelte`)

Entry point - redirects to login or dashboard based on auth status.

#### Dashboard (`src/routes/dashboard/+page.svelte`)

Main authenticated page showing:

- Welcome message with user name
- 8 content domain cards
- Quick links to each section
- Content count placeholders

#### Posts List (`src/routes/posts/+page.svelte`)

- Displays paginated list of posts
- Shows title, excerpt, status, created date
- Create new post button
- Pagination controls
- Click to view detail

#### Post Detail (`src/routes/posts/[slug]/+page.svelte`)

- Full post content
- Display skills, categories, tags
- Back button
- Edit button

### Domain Pages (Stub)

Placeholder pages for all content domains:

- `/problem-solutions` - Problem Solutions list
- `/case-studies` - Case Studies list
- `/technical-writings` - Technical Writings list

Each shows "Coming soon" with same layout pattern.

## Component Patterns

### Authentication Guard Pattern

```svelte
<script lang="ts">
	import { auth } from '$lib';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let isLoading = true;

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
			return;
		}
		isLoading = false;
	});
</script>

{#if isLoading}
	<p>Loading...</p>
{:else}
	<!-- Protected content -->
{/if}
```

### Form Pattern

```svelte
<script lang="ts">
	let formData = {};
	let isLoading = false;
	let error = '';

	async function handleSubmit() {
		error = '';
		isLoading = true;

		try {
			// API call
		} catch (err: any) {
			error = err.message || 'Error occurred';
		} finally {
			isLoading = false;
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<!-- Form fields -->
	<button disabled={isLoading}>
		{isLoading ? 'Saving...' : 'Save'}
	</button>
</form>
```

### List Pattern

```svelte
<script lang="ts">
	let items = [];
	let isLoading = true;
	let currentPage = 1;

	onMount(async () => {
		await loadItems();
	});

	async function loadItems() {
		try {
			const response = await client.list(currentPage, 10);
			items = response.data;
		} catch (err) {
			error = err.message;
		} finally {
			isLoading = false;
		}
	}
</script>

{#each items as item (item.id)}
	<!-- Item display -->
{/each}
```

## Styling Approach

### Tailwind CSS

All components use Tailwind CSS utility classes:

**Common patterns:**

- `bg-blue-600 hover:bg-blue-700` - Button styling
- `rounded-md shadow-sm` - Card styling
- `text-gray-900` - Text colors
- `border border-gray-300` - Input styling
- `py-2 px-4` - Padding utilities

**Responsive:**

- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)

### Component Classes

Reusable styling patterns:

- `.min-h-screen` - Full viewport height
- `.max-w-7xl` - Max content width
- `.mx-auto` - Center content
- `.py-6 sm:px-6 lg:px-8` - Responsive padding

## State Management

### Global State (Svelte Stores)

```typescript
import { auth } from '$lib';

// Reactive bindings
$auth.user
$auth.isAuthenticated
$auth.isLoading
$auth.error
```

### Local State (Component Variables)

```typescript
let formData = { title: '' };
let isLoading = false;
let error = '';
```

### Route State (Page Stores)

```typescript
import { page } from '$app/stores';

const slug = $page.params.slug;
const query = $page.url.searchParams.get('sort');
```

## Navigation

### Programmatic Navigation

```typescript
import { goto } from '$app/navigation';

await goto('/dashboard');
await goto('/posts/my-slug');
```

### Link Components

```svelte
<a href="/dashboard">Dashboard</a>
<a href="/posts/{post.slug}">View Post</a>
```

## Best Practices

1. **Always check auth** in protected pages
2. **Show loading state** during async operations
3. **Handle errors gracefully** with user messages
4. **Use TypeScript** for type safety
5. **Follow naming conventions** for consistency
6. **Keep components focused** on single responsibility
7. **Reuse patterns** from existing components
8. **Use Tailwind** for all styling
