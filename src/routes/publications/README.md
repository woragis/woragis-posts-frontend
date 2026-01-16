# Publications Frontend Integration Guide

Complete SvelteKit frontend for the Publications domain with multi-platform publishing support.

## Overview

The Publications frontend provides:
- **Publication management** - Create, read, update, delete publications
- **Multi-platform publishing** - Publish content to multiple platforms simultaneously
- **Publishing workflow** - State machine UI for skeleton → draft → scheduled → published → archived
- **Media management** - Upload and manage publication media
- **Platform management** - View and configure publishing platforms
- **Advanced filtering** - Filter by status, content type, archive status

## Architecture

### File Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── publications/
│   │   │   └── client.ts          # PublicationsApiClient with all endpoints
│   │   └── types.ts               # All Publication-related TypeScript types
│   ├── index.ts                   # Library exports
│   └── stores/
│       └── auth.ts                # Authentication state (already exists)
└── routes/
    └── publications/
        ├── +layout.svelte         # Publications section layout
        ├── +page.svelte           # List publications with filters
        ├── create/
        │   └── +page.svelte       # Create new publication form
        └── [id]/
            ├── +page.svelte       # Publication detail & publishing
            ├── edit/
            │   └── +page.svelte   # Edit publication metadata
            └── detail/
                └── [id]/
                    └── +page.svelte (removed - merged into [id]/+page.svelte)
```

### API Client (`src/lib/api/publications/client.ts`)

TypeScript client extending `BaseApiClient` with typed methods:

#### Publications CRUD
```typescript
// Create publication
const pub = await publicationsClient.createPublication({
  contentId: 'post-123',
  contentType: 'post',
  title: 'My Article',
  outline: 'Brief summary'
});

// List with filters
const { data, meta } = await publicationsClient.listPublications({
  status: 'draft',
  contentType: 'technical_writing',
  isArchived: false,
  limit: 20,
  offset: 0
});

// Get single publication
const pub = await publicationsClient.getPublication(pubId);

// Update publication
await publicationsClient.updatePublication(pubId, {
  title: 'Updated Title',
  outline: 'New outline',
  status: 'scheduled',
  isArchived: false
});

// Delete publication
await publicationsClient.deletePublication(pubId);
```

#### Publishing Operations
```typescript
// List available platforms
const platforms = await publicationsClient.listPlatforms();

// Publish to single platform
const pubPlatform = await publicationsClient.publishToplatform(
  publicationId,
  platformId,
  { metadata: { hashtags: '#tech' } }
);

// Bulk publish to multiple platforms
const results = await publicationsClient.bulkPublish(publicationId, {
  platformIds: ['platform-1', 'platform-2', 'platform-3'],
  metadata: { hashtags: '#tech #writing' }
});

// Unpublish from platform
await publicationsClient.unpublishFromPlatform(publicationId, platformId);

// List publication platforms
const pubPlatforms = await publicationsClient.listPublicationPlatforms(publicationId);

// Retry failed publish
const retried = await publicationsClient.retryPublish(publicationId, platformId);
```

#### Media Management
```typescript
// Upload media
const media = await publicationsClient.uploadMedia(
  publicationId,
  platformId,
  'screenshot',
  fileObject
);

// List publication media
const mediaList = await publicationsClient.listPublicationMedia(publicationId);

// Delete media
await publicationsClient.deleteMedia(publicationId, mediaId);
```

## Pages

### Publications List (`/publications`)

Displays all user publications with advanced filtering.

**Features:**
- Paginated list (20 items per page)
- Filter by status (skeleton, draft, scheduled, published, archived)
- Filter by content type (8 types supported)
- Filter by archive status
- Click to view publication details
- Quick create button

**URL Route:** `/publications`

**Components Used:**
- Status badge with color coding
- Content type indicator
- Publication count
- Creation date display
- Platform publication count

### Create Publication (`/publications/create`)

Simple form to create new publication.

**Form Fields:**
- `title` * - Publication title (required)
- `contentId` * - ID of source content (required)
- `contentType` * - Type of content (required, 8 options)
- `outline` - Brief summary (optional)

**Flow:**
1. User fills form
2. On submit, calls `createPublication()`
3. Backend returns publication with `skeleton` status
4. Redirect to detail page

**URL Route:** `/publications/create`

### Publication Detail (`/publications/[id]`)

Main publication view with publishing capabilities.

**Two-Column Layout:**

**Left Column (Main):**
- Publication metadata (title, outline, type, status)
- Created/updated dates
- Edit button
- Published platforms list with:
  - Platform name
  - Current status (pending, publishing, published, failed)
  - Published URL (if available)
  - Publish date
  - Retry count
  - Retry button (if failed)
  - Unpublish button

**Right Column (Sidebar):**
- "Publish to Platforms" card
- List of unpublished, active platforms
- Click to open publish modal

**Modals:**
- Publish confirmation modal
  - Shows publication title
  - Shows target platform
  - Cancel/Confirm buttons

**URL Route:** `/publications/[id]`

**State Management:**
- `publication` - Current publication data
- `platforms` - All available platforms
- `publishedPlatforms` - Platforms this publication is published to
- `showPublishModal` - Publish modal visibility
- `selectedPlatformId` - Currently selected platform for publishing

### Edit Publication (`/publications/[id]/edit`)

Edit publication metadata and state.

**Form Fields:**
- `title` * - Publication title (required)
- `outline` - Publication outline (optional)
- `status` - Current status with state machine info
- `isArchived` - Checkbox to archive

**Features:**
- State transition guidance (skeleton → draft → scheduled → published → archived)
- Archive toggle
- Delete button with confirmation
- Auto-redirect after save

**URL Route:** `/publications/[id]/edit`

## Type System

### Core Types

```typescript
// Publication entity
interface Publication {
  id: string;
  userId: string;
  contentId: string;
  contentType: ContentType;
  title: string;
  outline?: string;
  status: PublicationStatus;
  isArchived: boolean;
  platforms?: PublicationPlatform[];
  media?: PublicationMedia[];
  createdAt: string;
  updatedAt: string;
}

// Status and content type unions
type PublicationStatus = 'skeleton' | 'draft' | 'scheduled' | 'published' | 'archived';
type ContentType = 'post' | 'case_study' | 'problem_solution' | 'technical_writing' | 
                   'system_design' | 'report' | 'impact_metric' | 'aiml_integration';
type PublicationMediaType = 'screenshot' | 'archive' | 'thumbnail' | 'attachment' | 'metadata';
type PublicationPlatformStatus = 'pending' | 'publishing' | 'published' | 'failed';
```

### Request/Response Types

```typescript
// Create publication
interface CreatePublicationRequest {
  contentId: string;
  contentType: ContentType;
  title: string;
  outline?: string;
}

// Update publication
interface UpdatePublicationRequest {
  title?: string;
  outline?: string;
  status?: PublicationStatus;
  isArchived?: boolean;
}

// Publish to platform
interface PublishRequest {
  metadata?: Record<string, any>;
  scheduledAt?: string;
}

// Bulk publish
interface BulkPublishRequest {
  platformIds: string[];
  metadata?: Record<string, any>;
}
```

## Authentication

All API calls include JWT Bearer token via request interceptor in `BaseApiClient`:

```typescript
// Token automatically added to all requests
const token = tokenCookies.getAccessToken();
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

## Styling

Pages use:
- **Tailwind CSS** for utility styling
- **Color scheme:**
  - Status badges: skeleton (gray), draft (yellow), scheduled (blue), published (green), failed (red)
  - Buttons: blue for primary, red for delete, gray for secondary
- **Responsive:** Mobile-first with lg: breakpoint for multi-column layouts
- **Sticky sidebar** for publishing options

## Error Handling

All pages implement consistent error handling:

```typescript
try {
  await publicationsClient.operation();
} catch (err: any) {
  error = err.message || 'Operation failed';
  // Error shown in red alert box
}
```

## Performance Considerations

- **Pagination:** Default 20 items, configurable up to 100
- **Lazy loading:** Data loaded on component mount
- **Eager loading:** Backend pre-loads related platforms/media
- **Caching:** Considered for future enhancement
- **Modal-based publishing:** Prevents accidental publishes

## Future Enhancements

1. **Media Upload UI** - File picker and upload progress
2. **Scheduled Publishing** - Date/time picker for scheduled posts
3. **Bulk Operations** - Select multiple publications for bulk actions
4. **Publishing Analytics** - View engagement per platform
5. **Draft Autosave** - Periodically save form state
6. **Keyboard Shortcuts** - Quick publish with Cmd+P
7. **Search** - Full-text search across publications
8. **Social Media Preview** - Show how post looks on each platform

## Testing

Example integration test pattern:

```typescript
import { render } from '@testing-library/svelte';
import Publications from './+page.svelte';

describe('Publications List', () => {
  it('loads and displays publications', async () => {
    const { getByText } = render(Publications);
    // Test implementation
  });

  it('filters by status', async () => {
    // Filter test
  });

  it('handles API errors gracefully', async () => {
    // Error handling test
  });
});
```

## Quick Start

1. **Access Publications:** Navigate to `/publications` in the app
2. **Create Publication:** Click "New Publication" button
3. **Fill Form:** Enter title, content ID, and type
4. **Submit:** Saves with `skeleton` status
5. **Publish:** Click publication, select platform, click "Publish"
6. **Monitor:** See status updates in real-time

## Endpoint Mapping

| Feature | Method | Endpoint |
|---------|--------|----------|
| List | GET | `/publications?limit=20&offset=0&status=draft` |
| Create | POST | `/publications` |
| Get | GET | `/publications/{id}` |
| Update | PUT | `/publications/{id}` |
| Delete | DELETE | `/publications/{id}` |
| Platforms | GET | `/publications/platforms` |
| Publish | POST | `/publications/{id}/publish/{platformId}` |
| Unpublish | DELETE | `/publications/{id}/publish/{platformId}` |
| List Platforms | GET | `/publications/{id}/publish` |
| Retry | POST | `/publications/{id}/publish/{platformId}/retry` |
| Bulk Publish | POST | `/publications/{id}/publish/bulk` |
| Upload Media | POST | `/publications/{id}/media` |
| List Media | GET | `/publications/{id}/media` |
