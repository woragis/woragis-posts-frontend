# API Integration Guide

## Architecture

The frontend uses a modular API client architecture with the following layers:

### 1. Base Client (`BaseApiClient`)

Abstract class providing standard CRUD operations:

- `create<T>(data)` - POST /
- `list<T>(page, limit)` - GET / with pagination
- `getById<T>(id)` - GET /{id}
- `update<T>(id, data)` - PATCH /{id}
- `delete(id)` - DELETE /{id}

### 2. Domain Clients

Specialized clients extending `BaseApiClient`:

```typescript
// Example: PostsApiClient
class PostsApiClient extends BaseApiClient {
  async createPost(data: CreatePostRequest): Promise<Post>
  async listPosts(page, limit): Promise<PaginatedApiResponse<Post>>
  async getPostBySlug(slug: string): Promise<Post>
  async getPost(id: string): Promise<Post>
  async updatePost(id: string, data: UpdatePostRequest): Promise<Post>
  async deletePost(id: string): Promise<void>
}
```

Clients for each domain:

- `PostsApiClient` → posts/
- `ProblemSolutionsApiClient` → problem-solutions/
- `CaseStudiesApiClient` → case-studies/
- `TechnicalWritingsApiClient` → technical-writings/
- `SystemDesignsApiClient` → system-designs/
- `ReportsApiClient` → reports/
- `ImpactMetricsApiClient` → impact-metrics/
- `AimlIntegrationsApiClient` → aiml-integrations/

### 3. Authentication

Token-based authentication with automatic refresh:

```typescript
// Login
const response = await authClient.login({ email, password });
// Token stored in secure cookie

// Automatic token injection
// All requests include: Authorization: Bearer {token}

// Token refresh on 401
// If access token expires, refresh token is used to get new one
```

## Request/Response Flow

```
Component
  ↓
Svelte Store (auth)
  ↓
API Client (postsClient, etc.)
  ↓
createApiClient (axios)
  ↓ (interceptors)
    ├─ Add Authorization header
    ├─ Handle 401 (refresh token)
    └─ Parse error messages
  ↓
Backend Service (Posts, Auth)
  ↓ (response)
    ├─ { data: T, meta: PaginationMeta }
    ├─ Parse and return typed result
    └─ Throw typed error
  ↓
Component State Update
```

## Type System

All API operations are fully typed:

```typescript
// Types auto-complete in IDE
const posts: Post[] = await postsClient.listPosts(1, 10).then(r => r.data);
const post: Post = await postsClient.getPost('post-id');

// Request types
const newPost = await postsClient.createPost({
  title: 'My Post',
  content: 'Content',
  excerpt: 'Excerpt'
} as CreatePostRequest);
```

## Error Handling

Errors are consistently handled:

```typescript
try {
  const posts = await postsClient.listPosts();
} catch (error) {
  const message = error.message; // 'Login required'
  // Error types: network error, validation error, auth error, server error
}
```

## Usage Examples

### List Posts

```typescript
const response = await postsClient.listPosts(page, limit);
const posts: Post[] = response.data;
const totalPages = Math.ceil(response.meta.total / limit);
```

### Get Single Post

```typescript
const post = await postsClient.getPost(postId);
// or by slug
const post = await postsClient.getPostBySlug('my-post-slug');
```

### Create Post

```typescript
const newPost = await postsClient.createPost({
  title: 'New Post',
  content: 'Post content',
  excerpt: 'Short excerpt',
  status: 'draft'
});
```

### Update Post

```typescript
const updated = await postsClient.updatePost(postId, {
  title: 'Updated Title',
  status: 'published'
});
```

### Delete Post

```typescript
await postsClient.deletePost(postId);
```

## Adding New Domain Clients

To add support for a new domain:

1. Create `src/lib/api/[domain]/client.ts`:

```typescript
import { BaseApiClient } from '../base-client';

class DomainApiClient extends BaseApiClient {
  constructor() {
    super(`http://localhost:3013/[domain]`);
  }
  // Add domain-specific methods
}

export const domainClient = new DomainApiClient();
```

2. Create `src/lib/api/[domain]/index.ts`:

```typescript
export { domainClient } from './client';
```

3. Export from `src/lib/index.ts`:

```typescript
export { domainClient } from './api/[domain]';
```

4. Add types to `src/lib/api/types.ts` if needed

5. Create pages in `src/routes/[domain]/+page.svelte`
