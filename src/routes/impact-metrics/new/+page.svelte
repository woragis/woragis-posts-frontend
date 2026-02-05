<script lang="ts">
	import { goto } from '$app/navigation';
	import { impactMetrics } from '$lib/stores/impact-metrics';
	import { ImpactMetricEditor } from '$lib/components/impact-metrics';

	let isSubmitting = false;
	let error: string | null = null;

	async function handleSubmit(data: any) {
		try {
			isSubmitting = true;
			await impactMetrics.createMetric(data);
			await goto('/impact-metrics');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to create metric';
			throw err;
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Create Impact Metric</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-2xl px-4">
		<div class="mb-8">
			<a href="/impact-metrics" class="text-blue-600 hover:text-blue-700 text-sm font-medium">&larr; Back to Metrics</a>
			<h1 class="mt-4 text-3xl font-bold text-gray-900">Create New Metric</h1>
			<p class="mt-2 text-gray-600">Add a new impact metric to track your achievements</p>
		</div>

		<div class="rounded-lg bg-white p-8 shadow-sm">
			{#if error}
				<div class="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
					{error}
				</div>
			{/if}

			<ImpactMetricEditor onSubmit={handleSubmit} />
		</div>
	</div>
</div>
