<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { aimlIntegrations } from '$lib/stores/aiml-integrations';
	import { AIMLIntegrationEditor } from '$lib/components/aiml-integrations';

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

	async function handleSubmit(data: any) {
		try {
			await aimlIntegrations.updateIntegration(id, data);
			await goto(`/aiml-integrations/${id}`);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to update integration';
			throw err;
		}
	}
</script>

<svelte:head>
	<title>Edit AIML Integration</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-2xl px-4">
		<div class="mb-8">
			<a
				href="/aiml-integrations/{id}"
				class="text-sm font-medium text-blue-600 hover:text-blue-700">&larr; Back to Integration</a
			>
			<h1 class="mt-4 text-3xl font-bold text-gray-900">Edit Integration</h1>
		</div>

		<div class="rounded-lg bg-white p-8 shadow-sm">
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
				<AIMLIntegrationEditor
					initialData={$aimlIntegrations.currentIntegration}
					onSubmit={handleSubmit}
				/>
			{:else}
				<div class="py-12 text-center text-gray-500">Integration not found</div>
			{/if}
		</div>
	</div>
</div>
