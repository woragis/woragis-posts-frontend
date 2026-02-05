<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { aimlIntegrations } from '$lib/stores/aiml-integrations';
	import { AIMLIntegrationView } from '$lib/components/aiml-integrations';

	let isLoading = false;
	let error: string | null = null;

	$: id = $page.params.id as string;

	onMount(async () => {
		try {
			isLoading = true;
			await aimlIntegrations.loadOne(id);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load integration';
		} finally {
			isLoading = false;
		}
	});

	function handleDelete() {
		if (confirm('Are you sure you want to delete this integration?')) {
			aimlIntegrations.deleteIntegration(id).then(() => {
				window.location.href = '/aiml-integrations';
			});
		}
	}
</script>

<svelte:head>
	<title>Integration Details</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-2xl px-4">
		<div class="mb-8">
			<a href="/aiml-integrations" class="text-sm font-medium text-blue-600 hover:text-blue-700"
				>&larr; Back to Integrations</a
			>
		</div>

		{#if error}
			<div class="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
				{error}
			</div>
		{/if}

		{#if isLoading}
			<div class="py-12 text-center">
				<div
					class="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"
				></div>
				<p class="mt-4 text-gray-600">Loading integration...</p>
			</div>
		{:else if $aimlIntegrations.currentIntegration}
			<AIMLIntegrationView integration={$aimlIntegrations.currentIntegration} />

			<div class="mt-6 flex gap-3">
				<a
					href="/aiml-integrations/{id}/edit"
					class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
				>
					✏️ Edit
				</a>
				<button
					on:click={handleDelete}
					class="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
				>
					🗑️ Delete
				</button>
			</div>
		{:else}
			<div class="py-12 text-center text-gray-500">Integration not found</div>
		{/if}
	</div>
</div>
