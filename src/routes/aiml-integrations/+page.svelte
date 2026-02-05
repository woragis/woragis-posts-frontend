<script lang="ts">
	import { onMount } from 'svelte';
	import { aimlIntegrations } from '$lib/stores/aiml-integrations';
	import { AIMLIntegrationsList } from '$lib/components/aiml-integrations';

	let isLoading = false;
	let error: string | null = null;

	onMount(async () => {
		try {
			isLoading = true;
			await aimlIntegrations.loadIntegrations();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load integrations';
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>AIML Integrations</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">🤖 AIML Integrations</h1>
			<p class="mt-2 text-gray-600">Showcase your AI and machine learning implementations</p>
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
				<p class="mt-4 text-gray-600">Loading integrations...</p>
			</div>
		{:else}
			<AIMLIntegrationsList />
		{/if}
	</div>
</div>
