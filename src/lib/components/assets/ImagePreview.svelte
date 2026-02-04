<script lang="ts">
	export let imageUrl: string | null = null;
	export let isLoading: boolean = false;
	export let error: string | null = null;

	let imageError = false;

	function handleImageError() {
		imageError = true;
	}
</script>

<div
	class="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-gray-300 bg-gray-100"
>
	{#if isLoading}
		<!-- Loading Skeleton -->
		<div class="h-full w-full animate-pulse bg-gray-300"></div>
	{:else if error}
		<!-- Error State -->
		<div class="p-4 text-center">
			<div class="mb-2 font-semibold text-red-600">Generation Failed</div>
			<p class="text-sm text-red-500">{error}</p>
		</div>
	{:else if imageUrl && !imageError}
		<!-- Generated Image -->
		<img
			src={imageUrl}
			alt="Generated"
			class="h-full w-full object-cover"
			on:error={handleImageError}
		/>
	{:else if imageError}
		<!-- Image Load Error -->
		<div class="p-4 text-center">
			<div class="mb-2 font-semibold text-gray-600">Image Failed to Load</div>
			<p class="text-sm text-gray-500">Try generating again</p>
		</div>
	{:else}
		<!-- Empty State -->
		<div class="text-center">
			<div class="mb-2 text-4xl text-gray-300">🖼️</div>
			<p class="text-gray-500">No image generated yet</p>
		</div>
	{/if}
</div>

<style>
	.aspect-video {
		aspect-ratio: 16 / 9;
	}
</style>
