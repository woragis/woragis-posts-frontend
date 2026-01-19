# Publications API Client Integration

TypeScript API client for the Publications backend domain.

## Client Location

File: `src/lib/api/publications/client.ts`

The client extends `BaseApiClient` and provides type-safe methods for all publication operations.

## Installation & Setup

The client is automatically initialized and exported from the library:

```typescript
// In any component/page
import { publicationsClient } from '$lib';

// Or directly
import { publicationsClient } from '$lib/api/publications/client';
```

Authentication (JWT Bearer token) is automatically handled by the base client.

## API Methods

### Publications CRUD

#### `createPublication(data: CreatePublicationRequest): Promise<Publication>`

Create a new publication in `skeleton` status.

```typescript
const publication = await publicationsClient.createPublication({
  contentId: 'post-uuid',
  contentType: 'technical_writing',
  title: 'Building Scalable Systems',
  outline: 'A guide to designing systems that scale'
});

// Returns:
// {
//   id: 'pub-uuid',
//   userId: 'user-uuid',
//   contentId: 'post-uuid',
//   contentType: 'technical_writing',
//   title: 'Building Scalable Systems',
//   outline: 'A guide to designing systems that scale',
//   status: 'skeleton',
//   isArchived: false,
//   platforms: [],
//   media: [],
//   createdAt: '2026-01-16T10:00:00Z',
//   updatedAt: '2026-01-16T10:00:00Z'
// }
```

#### `listPublications(filter?: PublicationFilter): Promise<PaginatedApiResponse<Publication>>`

List user's publications with optional filtering.

```typescript
// All publications
const all = await publicationsClient.listPublications();

// Filtered by status
const drafts = await publicationsClient.listPublications({
  status: 'draft',
  limit: 20,
  offset: 0
});

// Filtered by content type
const posts = await publicationsClient.listPublications({
  contentType: 'post',
  isArchived: false
});

// Multiple filters
const activeScheduled = await publicationsClient.listPublications({
  status: 'scheduled',
  contentType: 'case_study',
  isArchived: false,
  limit: 50,
  offset: 100
});

// Response structure:
// {
//   data: [{ Publication }, ...],
//   meta: {
//     page: 1,
//     limit: 20,
//     total: 156,
//     totalPages: 8
//   }
// }
```

**Filter Options:**

- `status?: PublicationStatus` - skeleton | draft | scheduled | published | archived
- `contentType?: ContentType` - 8 content types supported
- `isArchived?: boolean` - true/false/undefined (undefined = all)
- `limit?: number` - Default 20, max 100
- `offset?: number` - Default 0, for pagination

#### `getPublication(id: string): Promise<Publication>`

Get single publication with all relationships.

```typescript
const publication = await publicationsClient.getPublication('pub-123');

// Returns full Publication object including:
// - platforms: PublicationPlatform[]
// - media: PublicationMedia[]
```

#### `updatePublication(id: string, data: UpdatePublicationRequest): Promise<Publication>`

Update publication metadata and state.

```typescript
const updated = await publicationsClient.updatePublication('pub-123', {
  title: 'Updated Title',
  outline: 'New outline',
  status: 'draft',  // State transition
  isArchived: false
});

// Only provided fields are updated
```

**Valid State Transitions:**

- skeleton → draft
- draft → scheduled
- scheduled → published
- any state → archived
- archived → draft (unarchive)

Server validates transitions and returns 400 if invalid.

#### `deletePublication(id: string): Promise<void>`

Delete publication and all associated data (platforms, media).

```typescript
await publicationsClient.deletePublication('pub-123');

// This cascades delete:
// 1. All PublicationMedia records
// 2. All PublicationPlatform records
// 3. Publication record itself
```

### Platform Management

#### `listPlatforms(): Promise<Platform[]>`

Get all available publishing platforms.

```typescript
const platforms = await publicationsClient.listPlatforms();

// Returns:
// [
//   {
//     id: 'platform-1',
//     name: 'LinkedIn',
//     slug: 'linkedin',
//     description: 'Professional network',
//     icon: '💼',
//     color: '#0A66C2',
//     isActive: true
//   },
//   // ... 7 more default platforms
// ]
```

**Default Platforms:**

1. LinkedIn
2. Twitter/X
3. Instagram
4. Newsletter
5. Medium
6. Hashnode
7. Dev.to
8. Substack

#### `createPlatform(data: CreatePlatformRequest): Promise<Platform>`

Create custom publishing platform (admin only).

```typescript
const platform = await publicationsClient.createPlatform({
  name: 'Custom Blog',
  slug: 'custom-blog',
  description: 'My personal blog',
  icon: '📝',
  color: '#FF6B6B'
});
```

### Publishing Operations

#### `publishToplatform(publicationId: string, platformId: string, data?: PublishRequest): Promise<PublicationPlatform>`

Publish to single platform.

```typescript
const pubPlatform = await publicationsClient.publishToplatform(
  'pub-123',
  'linkedin',
  {
    metadata: {
      hashtags: '#technology #webdev',
      mentions: ['@user1', '@user2']
    },
    scheduledAt: '2026-02-01T10:00:00Z'
  }
);

// Returns:
// {
//   id: 'pub-plat-uuid',
//   publicationId: 'pub-123',
//   platformId: 'linkedin',
//   status: 'pending',        // or 'publishing', 'published', 'failed'
//   publishedAt: null,
//   publishedUrl: null,
//   metadata: { ... },
//   retryCount: 0,
//   platform: { ... }
// }
```

#### `bulkPublish(publicationId: string, data: BulkPublishRequest): Promise<PublicationPlatform[]>`

Publish to multiple platforms at once.

```typescript
const results = await publicationsClient.bulkPublish('pub-123', {
  platformIds: ['linkedin', 'twitter', 'medium'],
  metadata: {
    hashtags: '#tech #webdev',
    campaign: 'Q1-2026'
  }
});

// Returns array of PublicationPlatform, one per platform
```

#### `listPublicationPlatforms(publicationId: string): Promise<PublicationPlatform[]>`

Get all platforms this publication is published to.

```typescript
const pubPlatforms = await publicationsClient.listPublicationPlatforms('pub-123');

// Returns PublicationPlatform[] with eager-loaded Platform data
```

#### `unpublishFromPlatform(publicationId: string, platformId: string): Promise<void>`

Remove publication from platform.

```typescript
await publicationsClient.unpublishFromPlatform('pub-123', 'linkedin');

// Deletes the PublicationPlatform relationship
```

#### `retryPublish(publicationId: string, platformId: string): Promise<PublicationPlatform>`

Retry failed publish attempt.

```typescript
const retried = await publicationsClient.retryPublish('pub-123', 'twitter');

// Increments retryCount and attempts publish again
// Returns updated PublicationPlatform
```

### Media Management

#### `uploadMedia(publicationId: string, platformId: string, mediaType: string, file: File): Promise<PublicationMedia>`

Upload media file for publication.

```typescript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const media = await publicationsClient.uploadMedia(
  'pub-123',
  'linkedin',
  'screenshot',
  file
);

// Stores at: uploads/publications/{publicationId}/{uuid}_{filename}
// Returns:
// {
//   id: 'media-uuid',
//   publicationId: 'pub-123',
//   platformId: 'linkedin',
//   mediaType: 'screenshot',
//   filePath: 'uploads/publications/pub-123/abc-def_screenshot.png',
//   fileSize: 245000,
//   uploadedAt: '2026-01-16T10:00:00Z'
// }
```

**Media Types:**

- `screenshot` - Website/app screenshots
- `archive` - ZIP or archive files
- `thumbnail` - Cover images
- `attachment` - PDFs or documents
- `metadata` - JSON metadata files

#### `listPublicationMedia(publicationId: string): Promise<PublicationMedia[]>`

Get all media for publication.

```typescript
const media = await publicationsClient.listPublicationMedia('pub-123');

// Returns PublicationMedia[] for all platforms
```

#### `deleteMedia(publicationId: string, mediaId: string): Promise<void>`

Delete media file.

```typescript
await publicationsClient.deleteMedia('pub-123', 'media-uuid');

// Deletes file from local storage and database record
```

## Error Handling

All methods wrap errors with context:

```typescript
try {
  await publicationsClient.operation();
} catch (err: any) {
  const message = err.message;  // "Publication not found"
  const status = err.response?.status;  // 404, 400, 500, etc.

  // Common errors:
  // 400 - Invalid request (validation failed)
  // 401 - Unauthorized (invalid token)
  // 403 - Forbidden (not owner of publication)
  // 404 - Not found
  // 409 - Conflict (already published)
  // 500 - Server error
}
```

## Pagination

List endpoints support offset-based pagination:

```typescript
const page1 = await publicationsClient.listPublications({
  limit: 20,
  offset: 0
});

const page2 = await publicationsClient.listPublications({
  limit: 20,
  offset: 20
});

const page3 = await publicationsClient.listPublications({
  limit: 20,
  offset: 40
});

// Meta contains:
// {
//   page: 1,
//   limit: 20,
//   total: 156,        // Total records
//   totalPages: 8      // Calculated pages
// }
```

## Performance Tips

1. **Batch operations** - Use `bulkPublish` instead of multiple `publishToplatform` calls
2. **Pagination** - Use offset/limit for large lists
3. **Lazy load** - Load platforms only when needed
4. **Error recovery** - Use `retryPublish` for transient failures
5. **Caching** - Future enhancement for platforms and filter results

## Example Component

```svelte
<script lang="ts">
	import { publicationsClient } from '$lib';
	import type { Publication } from '$lib/api/types';

	let publications: Publication[] = [];
	let loading = true;

	onMount(async () => {
		try {
			const { data } = await publicationsClient.listPublications({
				status: 'draft',
				limit: 10
			});
			publications = data;
		} catch (err) {
			console.error('Failed to load:', err.message);
		} finally {
			loading = false;
		}
	});

	async function publish(pubId: string) {
		const platforms = await publicationsClient.listPlatforms();
		if (platforms.length > 0) {
			await publicationsClient.publishToplatform(pubId, platforms[0].id);
		}
	}
</script>
```

## Types Reference

See `src/lib/api/types.ts` for complete type definitions:

- `Publication` - Main entity
- `PublicationPlatform` - Platform relationship
- `PublicationMedia` - Media files
- `Platform` - Publishing platform
- `CreatePublicationRequest` - Create DTO
- `UpdatePublicationRequest` - Update DTO
- `PublishRequest` - Publish DTO
- `BulkPublishRequest` - Bulk publish DTO
- `PublicationFilter` - Filter options
- Type unions: `PublicationStatus`, `ContentType`, `PublicationMediaType`, `PublicationPlatformStatus`
