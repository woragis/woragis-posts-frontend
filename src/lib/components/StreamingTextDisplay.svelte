<script lang="ts">
	import type { StreamChunk } from '$lib/api/ai';

	export let isLoading = false;
	export let streamContent = '';
	export let error = '';
	export let onCancel: (() => void) | null = null;

	let scrollElement: HTMLDivElement;

	$: if (scrollElement) {
		scrollElement.scrollTop = scrollElement.scrollHeight;
	}
</script>

<div
	bind:this={scrollElement}
	class="flex-1 border border-gray-300 rounded bg-gray-50 p-4 overflow-y-auto min-h-64 max-h-96 font-mono text-sm whitespace-pre-wrap break-words"
>
	{#if error}
		<div class="text-red-600">
			<strong>Error:</strong>
			{error}
		</div>
	{:else if streamContent}
		{streamContent}
	{:else if isLoading}
		<div class="text-gray-500 animate-pulse">Generating draft...</div>
	{:else}
		<div class="text-gray-400">Draft will appear here</div>
	{/if}
</div>

{#if isLoading && onCancel}
	<button
		on:click={onCancel}
		class="mt-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
	>
		Stop Generation
	</button>
{/if}

<style>
	/* Ensure text is selectable and copyable */
	div {
		user-select: text;
	}
</style>
