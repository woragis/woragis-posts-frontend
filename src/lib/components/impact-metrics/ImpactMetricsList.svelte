<script lang="ts">
	import { impactMetrics } from '$lib/stores/impact-metrics';
	import type { ImpactMetric } from '$lib/api/types';

	let currentPage = 0;
	const itemsPerPage = 10;

	$: paginatedItems = $impactMetrics.items.slice(
		currentPage * itemsPerPage,
		(currentPage + 1) * itemsPerPage
	);
	$: totalPages = Math.ceil(($impactMetrics.items.length || 0) / itemsPerPage);

	async function handleDelete(id: string) {
		if (confirm('Delete this metric?')) {
			try {
				await impactMetrics.deleteMetric(id);
			} catch (err) {
				console.error('Delete failed:', err);
			}
		}
	}

	function formatDate(date: string | undefined) {
		if (!date) return '';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getTypeLabel(type: string) {
		const labels: Record<string, string> = {
			projects_delivered: 'Projects Delivered',
			users_impacted: 'Users Impacted',
			performance_improvement: 'Performance Improvement',
			cost_savings: 'Cost Savings',
			time_saved: 'Time Saved'
		};
		return labels[type] || type;
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold text-gray-900">Impact Metrics</h2>
		<a
			href="/impact-metrics/new"
			class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
		>
			+ New Metric
		</a>
	</div>

	{#if $impactMetrics.isLoading}
		<div class="text-center py-8 text-gray-500">Loading metrics...</div>
	{:else if paginatedItems.length === 0}
		<div class="text-center py-8 text-gray-500">No metrics yet. Create one to get started.</div>
	{:else}
		<div class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
			<table class="w-full">
				<thead>
					<tr class="border-b border-gray-200 bg-gray-50">
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Value</th>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each paginatedItems as metric (metric.id)}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-6 py-4">
								<div class="font-medium text-gray-900">
									{#if metric.featured}
										<span class="mr-2">⭐</span>
									{/if}
									{getTypeLabel(metric.type)}
								</div>
							</td>
							<td class="px-6 py-4 text-sm font-mono text-gray-900">
								<span class="font-semibold">{metric.value}</span>
								<span class="text-gray-600 ml-1">{metric.unit}</span>
							</td>
							<td class="px-6 py-4 text-sm text-gray-600">
								{metric.description || '-'}
							</td>
							<td class="px-6 py-4 text-sm text-gray-600">
								{formatDate(metric.createdAt)}
							</td>
							<td class="px-6 py-4 text-sm">
								<div class="flex gap-2">
									<a
										href="/impact-metrics/{metric.id}"
										class="text-blue-600 hover:text-blue-700"
										title="View"
									>
										👁️
									</a>
									<a
										href="/impact-metrics/{metric.id}/edit"
										class="text-blue-600 hover:text-blue-700"
										title="Edit"
									>
										✏️
									</a>
									<button
										on:click={() => handleDelete(metric.id)}
										class="text-red-600 hover:text-red-700"
										title="Delete"
									>
										🗑️
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if totalPages > 1}
			<div class="flex items-center justify-between">
				<button
					on:click={() => (currentPage = Math.max(0, currentPage - 1))}
					disabled={currentPage === 0}
					class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					← Previous
				</button>
				<span class="text-sm text-gray-600">
					Page {currentPage + 1} of {totalPages}
				</span>
				<button
					on:click={() => (currentPage = Math.min(totalPages - 1, currentPage + 1))}
					disabled={currentPage === totalPages - 1}
					class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Next →
				</button>
			</div>
		{/if}
	{/if}

	{#if $impactMetrics.error}
		<div class="rounded-lg bg-red-50 p-4 text-sm text-red-700">
			Error: {$impactMetrics.error}
		</div>
	{/if}
</div>
