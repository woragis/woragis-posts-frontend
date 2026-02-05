<script lang="ts">
	import { onMount } from 'svelte';
	import { impactMetrics } from '$lib/stores/impact-metrics';
	import { ImpactMetricsList } from '$lib/components/impact-metrics';

	let isLoading = false;
	let error: string | null = null;

	onMount(async () => {
		try {
			isLoading = true;
			await impactMetrics.loadMetrics();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load metrics';
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>Impact Metrics</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">📊 Impact Metrics</h1>
				<p class="mt-2 text-gray-600">Track and manage your measurable impact across projects</p>
			</div>
			<a href="/impact-metrics/new" class="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
				+ New Metric
			</a>
		</div>

		{#if error}
			<div class="rounded-lg bg-red-50 p-4 text-red-700 mb-6">
				{error}
			</div>
		{/if}

		{#if isLoading}
			<div class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="mt-4 text-gray-600">Loading metrics...</p>
			</div>
		{:else}
			<ImpactMetricsList />
		{/if}
	</div>
</div>
