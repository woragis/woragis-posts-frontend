<script lang="ts">
	import { onMount } from 'svelte';
	import type { CreativeAsset } from '$lib/api/creative';
	import { getAssets } from '$lib/api/creative';

	export let postId: string;

	let assets: CreativeAsset[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			assets = await getAssets(postId);
		} catch (err: any) {
			error = err.message || 'Failed to load assets';
		} finally {
			loading = false;
		}
	});

	function getStatusBadgeColor(status: string): string {
		switch (status) {
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'processing':
				return 'bg-blue-100 text-blue-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'failed':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getAssetTypeLabel(type: string): string {
		switch (type) {
			case 'thumbnail':
				return '📷 Thumbnail';
			case 'featured-image':
				return '🖼️ Featured Image';
			case 'og-image':
				return '📱 OG Image';
			default:
				return type;
		}
	}
</script>

<div class="space-y-4">
	<h3 class="text-lg font-bold">Generated Assets</h3>

	{#if loading}
		<div class="py-8 text-center">
			<p class="text-gray-600">Loading assets...</p>
		</div>
	{:else if error}
		<div class="rounded border border-red-200 bg-red-50 p-4">
			<p class="text-red-700">{error}</p>
		</div>
	{:else if assets.length === 0}
		<div class="rounded-lg bg-gray-50 py-8 text-center">
			<p class="text-gray-600">No assets generated yet</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-3">
			{#each assets as asset (asset.id)}
				<div class="rounded-lg border border-gray-200 p-4 transition hover:border-gray-300">
					<div class="mb-2 flex items-start justify-between">
						<div>
							<p class="font-medium text-gray-900">{getAssetTypeLabel(asset.assetType)}</p>
							<p class="text-sm text-gray-500">
								{new Date(asset.updatedAt).toLocaleDateString()}
							</p>
						</div>
						<span
							class={`rounded px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(asset.jobStatus)}`}
						>
							{asset.jobStatus}
						</span>
					</div>

					{#if asset.jobStatus === 'processing' || asset.jobStatus === 'pending'}
						<div class="mb-2">
							<div class="h-1 w-full rounded bg-gray-200">
								<div
									class="h-1 rounded bg-blue-500 transition"
									style="width: {asset.jobProgress}%"
								></div>
							</div>
							<p class="mt-1 text-xs text-gray-500">{asset.jobProgress}% complete</p>
						</div>
					{/if}

					{#if asset.jobStatus === 'completed' && asset.imageUrl}
						<div class="mb-3">
							<img
								src={asset.imageUrl}
								alt={asset.assetType}
								class="max-h-32 w-full cursor-pointer rounded object-cover hover:opacity-90"
							/>
						</div>
						<div class="flex gap-2">
							<a
								href={asset.imageUrl}
								target="_blank"
								rel="noreferrer"
								class="flex-1 rounded bg-blue-600 px-3 py-1 text-center text-sm text-white transition hover:bg-blue-700"
							>
								View
							</a>
							<button
								on:click={() => {
									navigator.clipboard.writeText(asset.imageUrl || '');
								}}
								class="flex-1 rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-300"
							>
								Copy URL
							</button>
						</div>
					{:else if asset.jobStatus === 'failed'}
						<p class="text-sm text-red-600">{asset.errorMessage || 'Generation failed'}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
