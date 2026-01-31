<script lang="ts">
	import { marked } from 'marked';
	import { writable } from 'svelte/store';

	export let markdown = '';
	export let placeholder = 'Enter article content in Markdown...';
	export let showPreview = true;

	let previewHtml = '';

	// Update preview whenever markdown changes
	$: {
		marked.parse(markdown).then((html) => {
			previewHtml = html;
		});
	}

	let activeTab: 'edit' | 'preview' = 'edit';
</script>

<div class="border border-gray-300 rounded-lg overflow-hidden bg-white">
	<!-- Tab Navigation -->
	<div class="flex border-b border-gray-200">
		<button
			on:click={() => (activeTab = 'edit')}
			class={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition ${
				activeTab === 'edit'
					? 'border-blue-600 text-blue-600'
					: 'border-transparent text-gray-600 hover:text-gray-900'
			}`}
		>
			Edit
		</button>
		{#if showPreview}
			<button
				on:click={() => (activeTab = 'preview')}
				class={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition ${
					activeTab === 'preview'
						? 'border-blue-600 text-blue-600'
						: 'border-transparent text-gray-600 hover:text-gray-900'
				}`}
			>
				Preview
			</button>
		{/if}
	</div>

	<!-- Content Area -->
	<div class="h-96">
		{#if activeTab === 'edit'}
			<textarea
				bind:value={markdown}
				{placeholder}
				class="w-full h-full px-4 py-3 font-mono text-sm border-0 focus:ring-0 resize-none"
			/>
		{:else}
			<div
				class="w-full h-full overflow-auto p-4 prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:font-semibold prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-red-600 prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200"
			>
				{@html previewHtml}
			</div>
		{/if}
	</div>

	<!-- Helper Text -->
	{#if activeTab === 'edit' && showPreview}
		<div class="bg-gray-50 px-4 py-2 border-t border-gray-200 text-xs text-gray-600">
			<strong>Markdown tips:</strong> Use **bold**, *italic*, `code`, [links](url), # Headings, - Lists
		</div>
	{/if}
</div>
