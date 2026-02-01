<script lang="ts">
	export let isLoading: boolean;
	export let streamContent: string = '';
	export let error: string = '';
	export let onCancel: (() => void) | null = null;

	let startTime: number = 0;
	let charCount: number = 0;
	let wordCount: number = 0;
	let estimatedReadingTime: number = 0;

	function calculateStats() {
		charCount = streamContent.length;
		wordCount = streamContent.trim().split(/\s+/).filter(w => w.length > 0).length;
		estimatedReadingTime = Math.ceil(wordCount / 200); // Average 200 words per minute
	}

	function formatTime(seconds: number): string {
		if (seconds < 60) return `${seconds}s`;
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}m ${secs}s`;
	}

	$: if (streamContent) {
		calculateStats();
	}

	$: if (isLoading && startTime === 0) {
		startTime = Date.now();
	} else if (!isLoading && startTime !== 0) {
		startTime = 0;
	}

	let elapsedSeconds = 0;

	// Update elapsed time while loading
	let interval: ReturnType<typeof setInterval> | undefined;
	$: if (isLoading && startTime > 0) {
		if (!interval) {
			interval = setInterval(() => {
				elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
			}, 1000);
		}
	} else if (interval) {
		clearInterval(interval);
		interval = undefined;
		elapsedSeconds = 0;
	}
</script>

<div class="space-y-3">
	{#if isLoading}
		<div class="flex items-center gap-2">
			<div class="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
			<span class="text-sm font-medium text-gray-700">Generating content...</span>
			<span class="text-xs text-gray-500">({formatTime(elapsedSeconds)})</span>
		</div>
	{/if}

	<!-- Content Display -->
	{#if streamContent || isLoading}
		<div class="bg-white border border-gray-300 rounded-lg p-4 min-h-64 max-h-96 overflow-y-auto font-mono text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
			{streamContent}
			{#if isLoading}
				<span class="animate-pulse">▌</span>
			{/if}
		</div>

		<!-- Statistics Bar -->
		{#if streamContent}
			<div class="grid grid-cols-4 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
				<div class="text-center">
					<div class="text-xl font-bold text-gray-900">{charCount}</div>
					<div class="text-xs text-gray-600">Characters</div>
				</div>
				<div class="text-center">
					<div class="text-xl font-bold text-gray-900">{wordCount}</div>
					<div class="text-xs text-gray-600">Words</div>
				</div>
				<div class="text-center">
					<div class="text-xl font-bold text-gray-900">{estimatedReadingTime}</div>
					<div class="text-xs text-gray-600">Min Read</div>
				</div>
				<div class="text-center">
					<div class="text-xl font-bold text-gray-900">{Math.floor(wordCount / Math.max(elapsedSeconds, 1))}</div>
					<div class="text-xs text-gray-600">Words/sec</div>
				</div>
			</div>
		{/if}
	{:else if !isLoading && error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
			<strong>Error:</strong> {error}
		</div>
	{:else if !isLoading && !streamContent && !error}
		<div class="bg-gray-50 border border-gray-300 rounded-lg p-8 text-center text-gray-500">
			<p class="text-sm">Generated content will appear here</p>
		</div>
	{/if}

	<!-- Action Bar -->
	{#if isLoading && onCancel}
		<div class="flex gap-2">
			<button
				on:click={onCancel}
				class="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition font-medium"
			>
				Cancel Generation
			</button>
		</div>
	{/if}
</div>

<style>
	/* Smooth animations */
	:global(.animate-pulse) {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
