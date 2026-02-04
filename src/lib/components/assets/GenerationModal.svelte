<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import ProgressIndicator from './ProgressIndicator.svelte';
	import ImagePreview from './ImagePreview.svelte';
	import {
		startGeneration,
		updateProgress,
		completeGeneration,
		failGeneration,
		generationState,
		generatedImageUrl,
		isGenerating
	} from '$lib/stores/assets';
	import {
		generateThumbnail,
		generateFeaturedImage,
		generateOGImage,
		subscribeToAssetUpdates,
		pollAssetStatus,
		type GenerateAssetResponse
	} from '$lib/api/creative';

	// Support both old (postId) and new (contentId) APIs
	export let postId: string | null = null;
	export let contentId: string | null = null;
	export let domainType: string = 'post';
	export let assetType: 'thumbnail' | 'featured-image' | 'og-image' = 'thumbnail';
	export let customPrompt: string = '';
	export const title: string = 'Generate Creative Assets';
	export const description: string = 'Generate professional images for your content';
	export const onClose: (() => void) | null = null;

	// Use contentId if provided, fallback to postId for backwards compatibility
	$: actualContentId = contentId || postId;

	let prompt = customPrompt;
	let showModal = false;
	let unsubscribeWebSocket: (() => void) | null = null;
	let pollInterval: NodeJS.Timeout | null = null;
	let useWebSocket = true; // Try WebSocket first

	// Use helper variable to avoid type narrowing issues
	$: curStatus = $generationState.status as string;

	const defaultPrompts = {
		thumbnail: 'Create a professional, eye-catching thumbnail',
		'featured-image': 'Create a high-quality featured image',
		'og-image': 'Create a social media preview image for sharing'
	};

	async function handleGenerate() {
		if (!actualContentId) {
			console.error('No content ID provided');
			return;
		}

		if (!prompt.trim()) {
			prompt = defaultPrompts[assetType];
		}

		try {
			// Call appropriate API
			let response: GenerateAssetResponse;
			switch (assetType) {
				case 'thumbnail':
					response = await generateThumbnail(actualContentId, prompt, domainType);
					break;
				case 'featured-image':
					response = await generateFeaturedImage(actualContentId, prompt, domainType);
					break;
				case 'og-image':
					response = await generateOGImage(actualContentId, prompt, domainType);
					break;
			}

			// Start tracking generation
			startGeneration(response.assetId, response.jobId);

			// Try WebSocket first
			if (useWebSocket && typeof WebSocket !== 'undefined') {
				try {
					unsubscribeWebSocket = subscribeToAssetUpdates(
						response.assetId,
						(update) => {
							if (update.type === 'progress') {
								updateProgress(update.progress, 'processing');
							} else if (update.type === 'completed') {
								completeGeneration(update.imageUrl || '', update.mimeType || 'image/png');
								if (pollInterval) clearInterval(pollInterval);
							} else if (update.type === 'failed') {
								failGeneration(update.error || 'Generation failed');
								if (pollInterval) clearInterval(pollInterval);
							}
						},
						(error) => {
							console.log('WebSocket error, falling back to polling:', error);
							useWebSocket = false;
							startPolling(response.assetId);
						}
					);
				} catch (err) {
					console.log('WebSocket failed, falling back to polling:', err);
					useWebSocket = false;
					startPolling(response.assetId);
				}
			} else {
				startPolling(response.assetId);
			}
		} catch (err: any) {
			failGeneration(err.message || 'Failed to start generation');
		}
	}

	function startPolling(assetId: string) {
		if (!actualContentId) return;

		pollInterval = setInterval(async () => {
			try {
				const asset = await pollAssetStatus(assetId, actualContentId, domainType);
				if (!asset) return;

				if (asset.jobStatus === 'processing') {
					updateProgress(asset.jobProgress, 'processing');
				} else if (asset.jobStatus === 'completed') {
					completeGeneration(asset.imageUrl || '', asset.mimeType || 'image/png');
					if (pollInterval) clearInterval(pollInterval);
				} else if (asset.jobStatus === 'failed') {
					failGeneration(asset.errorMessage || 'Generation failed');
					if (pollInterval) clearInterval(pollInterval);
				}
			} catch (err) {
				console.error('Polling error:', err);
			}
		}, 2000); // Poll every 2 seconds
	}

	function handleRetry() {
		handleGenerate();
	}

	function handleDone() {
		showModal = false;
	}

	onDestroy(() => {
		if (unsubscribeWebSocket) unsubscribeWebSocket();
		if (pollInterval) clearInterval(pollInterval);
	});
</script>

<!-- Button to open modal -->
<button
	on:click={() => (showModal = true)}
	disabled={$isGenerating}
	class="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
>
	{#if $isGenerating}
		⏳ Generating...
	{:else}
		Generate {assetType === 'thumbnail'
			? 'Thumbnail'
			: assetType === 'featured-image'
				? 'Featured Image'
				: 'OG Image'}
	{/if}
</button>

<!-- Modal -->
{#if showModal}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
			<!-- Header -->
			<h2 class="mb-4 text-xl font-bold">
				Generate {assetType === 'thumbnail'
					? 'Thumbnail'
					: assetType === 'featured-image'
						? 'Featured Image'
						: 'OG Image'}
			</h2>

			{#if !$generationState.assetId}
				<!-- Input Form - Ready to generate -->
				<div class="space-y-4">
					<div>
						<label for="prompt-textarea" class="mb-2 block text-sm font-medium text-gray-700">
							Custom Prompt (optional)
						</label>
						<textarea
							id="prompt-textarea"
							bind:value={prompt}
							placeholder={defaultPrompts[assetType]}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							rows="3"
						></textarea>
					</div>

					<div class="flex gap-2">
						<button
							on:click={handleGenerate}
							disabled={$isGenerating}
							class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:bg-gray-400"
						>
							Generate
						</button>
						<button
							on:click={() => (showModal = false)}
							class="flex-1 rounded-lg bg-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-400"
						>
							Cancel
						</button>
					</div>
				</div>
			{:else}
				<!-- Generation in Progress/Completed/Failed -->
				<div class="space-y-4">
					<!-- Preview -->
					<ImagePreview
						imageUrl={$generationState.imageUrl}
						isLoading={$generationState.status === 'processing' ||
							$generationState.status === 'pending'}
						error={$generationState.error}
					/>

					<!-- Progress -->
					<ProgressIndicator
						progress={$generationState.progress}
						status={$generationState.status}
						error={$generationState.error}
					/>

					<!-- Actions -->
					{#if curStatus === 'completed'}
						<div class="flex gap-2">
							<button
								on:click={handleRetry}
								class="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
							>
								Regenerate
							</button>
							<button
								on:click={handleDone}
								class="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
							>
								Done
							</button>
						</div>
					{:else if curStatus === 'failed'}
						<div class="flex gap-2">
							<button
								on:click={handleRetry}
								class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
							>
								Try Again
							</button>
							<button
								on:click={() => (showModal = false)}
								class="flex-1 rounded-lg bg-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-400"
							>
								Cancel
							</button>
						</div>
					{:else}
						<button
							on:click={() => (showModal = false)}
							class="w-full rounded-lg bg-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-400"
						>
							Close
						</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	textarea {
		resize: vertical;
	}
</style>
