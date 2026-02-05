<script lang="ts">
	import { reports } from '$lib/stores/reports';
	import type { Report } from '$lib/api/types';

	let currentPage = 0;
	const itemsPerPage = 10;

	$: paginatedItems = $reports.items.slice(
		currentPage * itemsPerPage,
		(currentPage + 1) * itemsPerPage
	);
	$: totalPages = Math.ceil(($reports.items.length || 0) / itemsPerPage);

	async function handleDelete(id: string) {
		if (confirm('Delete this report?')) {
			try {
				await reports.deleteReport(id);
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
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold text-gray-900">Reports</h2>
		<a
			href="/reports/new"
			class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
		>
			+ New Report
		</a>
	</div>

	{#if $reports.isLoading}
		<div class="py-8 text-center text-gray-500">Loading reports...</div>
	{:else if paginatedItems.length === 0}
		<div class="py-8 text-center text-gray-500">No reports yet. Create one to get started.</div>
	{:else}
		<div class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
			<table class="w-full">
				<thead>
					<tr class="border-b border-gray-200 bg-gray-50">
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sections</th>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each paginatedItems as report (report.id)}
						<tr class="transition-colors hover:bg-gray-50">
							<td class="px-6 py-4">
								<div class="font-medium text-gray-900">
									{#if report.isFavorite}
										<span class="mr-2">⭐</span>
									{/if}
									{report.name}
								</div>
							</td>
							<td class="px-6 py-4 text-sm text-gray-600">
								{report.description || '-'}
							</td>
							<td class="px-6 py-4 text-sm text-gray-600">
								{formatDate(report.createdAt)}
							</td>
							<td class="px-6 py-4 text-sm text-gray-600">
								{report.sections ? Object.keys(report.sections).length : 0}
							</td>
							<td class="px-6 py-4 text-sm">
								<div class="flex gap-2">
									<a
										href="/reports/{report.id}"
										class="text-blue-600 hover:text-blue-700"
										title="View"
									>
										👁️
									</a>
									<a
										href="/reports/{report.id}/edit"
										class="text-blue-600 hover:text-blue-700"
										title="Edit"
									>
										✏️
									</a>
									<button
										on:click={() => handleDelete(report.id)}
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
					class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					← Previous
				</button>
				<span class="text-sm text-gray-600">
					Page {currentPage + 1} of {totalPages}
				</span>
				<button
					on:click={() => (currentPage = Math.min(totalPages - 1, currentPage + 1))}
					disabled={currentPage === totalPages - 1}
					class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Next →
				</button>
			</div>
		{/if}
	{/if}

	{#if $reports.error}
		<div class="rounded-lg bg-red-50 p-4 text-sm text-red-700">
			Error: {$reports.error}
		</div>
	{/if}
</div>
