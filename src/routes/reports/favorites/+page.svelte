<script lang="ts">
	import { onMount } from 'svelte';
	import { reports } from '$lib/stores/reports';

	let currentPage = 0;
	const itemsPerPage = 1;

	onMount(async () => {
		try {
			await reports.loadReports();
		} catch (err) {
			console.error('Failed to load reports:', err);
		}
	});

	$: favoriteReports = $reports.items.filter((r: (typeof $reports.items)[0]) => r.isFavorite);
	$: currentReport = favoriteReports[currentPage] || null;
	$: totalFavorites = favoriteReports.length;
</script>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-4xl px-4">
		<div class="mb-8">
			<a href="/reports" class="text-sm font-medium text-blue-600 hover:text-blue-700">
				← Back to All Reports
			</a>
			<h1 class="mt-4 text-3xl font-bold text-gray-900">Favorite Reports</h1>
		</div>

		{#if totalFavorites === 0}
			<div class="rounded-lg bg-white p-12 text-center shadow">
				<p class="text-lg text-gray-600">
					No favorite reports yet. Mark some as favorites to see them here.
				</p>
			</div>
		{:else}
			<div class="rounded-lg bg-white p-8 shadow">
				{#if currentReport}
					<div class="mb-8">
						<h2 class="mb-2 text-2xl font-bold text-gray-900">{currentReport.name}</h2>
						<p class="text-gray-600">{currentReport.description || 'No description'}</p>
					</div>

					<div class="mb-8 space-y-4">
						{#if currentReport.sections && Object.keys(currentReport.sections).length > 0}
							<div>
								<h3 class="mb-3 text-lg font-semibold text-gray-900">Sections</h3>
								<div class="grid grid-cols-2 gap-3">
									{#each Object.keys(currentReport.sections) as sectionName}
										<div class="rounded bg-gray-50 p-3 text-sm text-gray-700 capitalize">
											{sectionName.replace(/_/g, ' ')}
										</div>
									{/each}
								</div>
							</div>
						{/if}

						{#if currentReport.filters && Object.keys(currentReport.filters).length > 0}
							<div>
								<h3 class="mb-3 text-lg font-semibold text-gray-900">Active Filters</h3>
								<div class="rounded bg-blue-50 p-4 text-sm">
									<pre class="overflow-x-auto font-mono text-xs">{JSON.stringify(
											currentReport.filters,
											null,
											2
										)}</pre>
								</div>
							</div>
						{/if}
					</div>

					<div class="flex items-center justify-between border-t border-gray-200 pt-6">
						<button
							on:click={() => (currentPage = Math.max(0, currentPage - 1))}
							disabled={currentPage === 0}
							class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							← Previous
						</button>
						<span class="text-sm text-gray-600">
							{currentPage + 1} of {totalFavorites}
						</span>
						<button
							on:click={() => (currentPage = Math.min(totalFavorites - 1, currentPage + 1))}
							disabled={currentPage === totalFavorites - 1}
							class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Next →
						</button>
					</div>

					<div class="mt-6 flex gap-2">
						<a
							href="/reports/{currentReport.id}"
							class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
						>
							View Full Report
						</a>
						<a
							href="/reports/{currentReport.id}/edit"
							class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
						>
							Edit
						</a>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
