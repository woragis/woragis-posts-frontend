<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { impactMetrics } from '$lib/stores/impact-metrics';
	import { ImpactMetricView } from '$lib/components/impact-metrics';

	let isLoading = false;
	let error: string | null = null;

	$: id = $page.params.id;

	onMount(async () => {
		try {
			isLoading = true;
			await impactMetrics.loadOne(id);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load metric';
		} finally {
			isLoading = false;
		}
	});

	function handleDelete() {
		if (confirm('Are you sure you want to delete this metric?')) {
			impactMetrics.deleteMetric(id).then(() => {
				window.location.href = '/impact-metrics';
			});
		}
	}
</script>

<svelte:head>
	<title>Metric Details</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-2xl px-4">
		<div class="mb-8">
			<a href="/impact-metrics" class="text-blue-600 hover:text-blue-700 text-sm font-medium">&larr; Back to Metrics</a>
		</div>

		{#if error}
			<div class="rounded-lg bg-red-50 p-4 text-red-700 mb-6">
				{error}
			</div>
		{/if}

		{#if isLoading}
			<div class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="mt-4 text-gray-600">Loading metric...</p>
			</div>
		{:else if $impactMetrics.currentMetric}
			<ImpactMetricView metric={$impactMetrics.currentMetric} />

			<div class="mt-6 flex gap-3">
				<a
					href="/impact-metrics/{id}/edit"
					class="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
				>
					✏️ Edit
				</a>
				<button
					on:click={handleDelete}
					class="rounded-lg bg-red-600 px-4 py-2 text-white font-medium hover:bg-red-700 transition-colors"
				>
					🗑️ Delete
				</button>
			</div>
		{:else}
			<div class="text-center py-12 text-gray-500">
				Metric not found
			</div>
		{/if}
	</div>
</div>
