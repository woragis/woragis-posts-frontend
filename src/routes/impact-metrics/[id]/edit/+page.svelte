<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { impactMetrics } from '$lib/stores/impact-metrics';
	import { ImpactMetricEditor } from '$lib/components/impact-metrics';

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

	async function handleSubmit(data: any) {
		try {
			await impactMetrics.updateMetric(id, data);
			await goto(`/impact-metrics/${id}`);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to update metric';
			throw err;
		}
	}
</script>

<svelte:head>
	<title>Edit Impact Metric</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-2xl px-4">
		<div class="mb-8">
			<a href="/impact-metrics/{id}" class="text-blue-600 hover:text-blue-700 text-sm font-medium">&larr; Back to Metric</a>
			<h1 class="mt-4 text-3xl font-bold text-gray-900">Edit Metric</h1>
		</div>

		<div class="rounded-lg bg-white p-8 shadow-sm">
			{#if error}
				<div class="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
					{error}
				</div>
			{/if}

			{#if isLoading}
				<div class="text-center py-12">
					<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<p class="mt-4 text-gray-600">Loading metric...</p>
				</div>
		{:else if $impactMetrics.currentMetric}
			<ImpactMetricEditor initialData={$impactMetrics.currentMetric} onSubmit={handleSubmit} />
			{:else}
				<div class="text-center py-12 text-gray-500">
					Metric not found
				</div>
			{/if}
		</div>
	</div>
</div>
