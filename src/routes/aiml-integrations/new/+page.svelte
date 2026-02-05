<script lang="ts">
	import { goto } from '$app/navigation';
	import { aimlIntegrations } from '$lib/stores/aiml-integrations';
	import { AIMLIntegrationEditor } from '$lib/components/aiml-integrations';

	let isSubmitting = false;
	let error: string | null = null;

	async function handleSubmit(data: any) {
		try {
			isSubmitting = true;
			await aimlIntegrations.createIntegration(data);
			await goto('/aiml-integrations');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to create integration';
			throw err;
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Create AIML Integration</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-2xl px-4">
		<div class="mb-8">
			<a href="/aiml-integrations" class="text-sm font-medium text-blue-600 hover:text-blue-700"
				>&larr; Back to Integrations</a
			>
			<h1 class="mt-4 text-3xl font-bold text-gray-900">Create New Integration</h1>
			<p class="mt-2 text-gray-600">Add a new AI/ML integration to your portfolio</p>
		</div>

		<div class="rounded-lg bg-white p-8 shadow-sm">
			{#if error}
				<div class="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
					{error}
				</div>
			{/if}

			<AIMLIntegrationEditor onSubmit={handleSubmit} />
		</div>
	</div>
</div>
