# Creative Assets Integration

This directory contains the components and utilities for integrating creative asset generation into the posts frontend.

## Structure

### API Client (`src/lib/api/creative.ts`)

- `generateThumbnail(postId, prompt)` - Generate a thumbnail
- `generateFeaturedImage(postId, prompt)` - Generate a featured image
- `generateOGImage(postId, prompt)` - Generate an Open Graph image
- `editImage(postId, assetId, prompt, imageUrl?, imageB64?)` - Edit existing image
- `getAssets(postId)` - Fetch all assets for a post
- `subscribeToAssetUpdates(assetId, onUpdate, onError)` - Real-time WebSocket updates
- `pollAssetStatus(assetId, postId)` - Poll for status (fallback)

### State Store (`src/lib/stores/assets.ts`)

Svelte store for managing asset generation state:

- `generationState` - Main state store
- `assetMap` - Map of all assets
- Functions: `startGeneration()`, `updateProgress()`, `completeGeneration()`, `failGeneration()`, `resetGeneration()`
- Derived stores: `isGenerating`, `generationProgress`, `generationStatus`, `generationError`, `generatedImageUrl`

### Components (`src/lib/components/assets/`)

#### GenerationModal.svelte

Modal component for generating assets with:

- Custom prompt input
- Real-time progress tracking
- WebSocket + polling support
- Preview of generated image
- Retry/regenerate functionality

**Props:**

- `postId: string` - ID of the post
- `assetType: 'thumbnail' | 'featured-image' | 'og-image'` - Asset type to generate
- `customPrompt: string` - Custom prompt (optional)

**Usage:**

```svelte
<GenerationModal {postId} assetType="thumbnail" />
```

#### ProgressIndicator.svelte

Shows generation progress with:

- Progress bar (0-100%)
- Status text
- Error messages

**Props:**

- `progress: number` - Progress percentage
- `status: 'pending' | 'processing' | 'completed' | 'failed'` - Current status
- `error: string | null` - Error message if failed

**Usage:**

```svelte
<ProgressIndicator progress={75} status="processing" />
```

#### ImagePreview.svelte

Displays generated image with:

- Loading skeleton
- Empty state
- Error state
- Image display

**Props:**

- `imageUrl: string | null` - URL to generated image
- `mimeType: string` - MIME type of image
- `isLoading: boolean` - Whether loading
- `error: string | null` - Error message

**Usage:**

```svelte
<ImagePreview {imageUrl} isLoading={loading} {error} />
```

#### AssetManager.svelte

Shows all assets for a post with:

- List of generated assets
- Status badges
- Image previews
- Download/copy URL options

**Props:**

- `postId: string` - ID of the post

**Usage:**

```svelte
<AssetManager {postId} />
```

## Quick Start

### 1. Add to a Page

```svelte
<script lang="ts">
	import { GenerationModal, AssetManager } from '$lib/components/assets';

	export let data;
</script>

<div class="space-y-4">
	<GenerationModal postId={data.post.id} assetType="thumbnail" />
	<AssetManager postId={data.post.id} />
</div>
```

### 2. Configure Environment

Update `.env`:

```env
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080
```

### 3. Use in Post Editor

Add to DraftBuilder.svelte or similar:

```svelte
<div class="mt-4 border-t pt-4">
	<h3 class="mb-4 text-lg font-bold">Generate Assets</h3>
	<div class="grid grid-cols-3 gap-2">
		<GenerationModal {postId} assetType="thumbnail" />
		<GenerationModal {postId} assetType="featured-image" />
		<GenerationModal {postId} assetType="og-image" />
	</div>
	<div class="mt-4">
		<AssetManager {postId} />
	</div>
</div>
```

## Features

### Real-time Updates

- WebSocket connection for instant progress updates
- Automatic fallback to polling if WebSocket unavailable
- Non-blocking UI updates with Svelte stores

### Error Handling

- Comprehensive error messages
- Retry functionality
- Graceful degradation

### Performance

- Minimal re-renders using derived stores
- Lazy loading of images
- Efficient WebSocket cleanup

## Architecture

```
User Action
    ↓
GenerationModal triggered
    ↓
Call API (generateThumbnail/etc)
    ↓
202 Accepted + assetId, jobId
    ↓
startGeneration() → update store
    ↓
Subscribe to updates via:
  ├─ WebSocket (if available)
  └─ Polling fallback (every 2s)
    ↓
updateProgress() as updates come in
    ↓
completeGeneration() or failGeneration()
    ↓
Update UI automatically via Svelte reactivity
```

## Backend Integration

The components communicate with the backend APIs:

```
POST /posts/:id/assets/generate/thumbnail
POST /posts/:id/assets/generate/featured-image
POST /posts/:id/assets/generate/og-image
POST /posts/:id/assets/edit
GET /posts/:id/assets
WS /posts/assets/ws/:assetId
```

For complete API documentation, see the backend implementation guide.

## Troubleshooting

### WebSocket fails

- Frontend tries WebSocket first
- Automatically falls back to polling
- Check browser console for details
- Verify `VITE_WS_URL` is correct

### Images don't show

- Check backend is running on correct port
- Verify `VITE_API_URL` is correct
- Check browser console for CORS errors

### Polling takes too long

- Default: 2 second interval
- Adjust in `GenerationModal.svelte` if needed
- WebSocket is preferred for faster updates

## Future Enhancements

1. **Batch Generation** - Generate all assets at once
2. **Prompt Templates** - AI-suggested prompts
3. **Image Editing** - Allow editing of generated images
4. **History** - Track generation history
5. **Analytics** - Track success rates and performance
6. **Caching** - Cache frequently generated images

## Testing

Components use standard Svelte testing patterns. Example:

```typescript
import { render } from '@testing-library/svelte';
import GenerationModal from './GenerationModal.svelte';

test('renders generation button', () => {
  const { getByText } = render(GenerationModal, { props: { postId: 'test' } });
  expect(getByText(/Generate/i)).toBeInTheDocument();
});
```

## Performance Notes

- WebSocket is non-blocking
- Polling is every 2 seconds (configurable)
- Images are lazy-loaded
- Store subscriptions are cleaned up on unmount
- Smooth CSS transitions on progress updates

## Support

For issues or questions:

1. Check browser console for errors
2. Verify backend API URLs
3. Check backend logs
4. Review API documentation
