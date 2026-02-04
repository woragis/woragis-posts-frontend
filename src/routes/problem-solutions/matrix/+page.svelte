<script lang="ts">
	import { onMount } from 'svelte';
	import { loadProblemSolutionMatrix, problemSolutions } from '$lib/stores/problem-solutions';

	onMount(async () => {
		await loadProblemSolutionMatrix();
	});
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<div class="mb-8">
				<h1 class="text-4xl font-bold text-gray-900 mb-2">Problem-Solution Matrix</h1>
				<p class="text-gray-600">Explore solutions categorized by problem domain and technical approach</p>
			</div>

			{#if $problemSolutions.isLoading}
				<div class="text-center py-12 bg-white rounded-lg shadow">
					<p class="text-gray-500">Loading matrix data...</p>
				</div>
			{:else if $problemSolutions.matrixData}
				<div class="bg-white rounded-lg shadow p-8">
					<!-- Matrix Placeholder - Backend returns matrix structure -->
					<div class="text-center py-12">
						<p class="text-gray-600 mb-4">Matrix visualization loading...</p>
						<p class="text-sm text-gray-500">
							Available problem solutions: {$problemSolutions.featuredItems.length + $problemSolutions.items.length}
						</p>
					</div>

					{#if $problemSolutions.matrixData.data}
						<div class="mt-8 overflow-x-auto">
							<table class="min-w-full divide-y divide-gray-200">
								<thead class="bg-gray-50">
									<tr>
										<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Category
										</th>
										<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Count
										</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200">
									{#each $problemSolutions.matrixData.data as row}
										<tr class="hover:bg-gray-50">
											<td class="px-6 py-4 text-sm text-gray-900">{row.category}</td>
											<td class="px-6 py-4 text-sm text-gray-500">{row.count}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</div>
			{:else}
				<div class="text-center py-12 bg-white rounded-lg shadow">
					<p class="text-gray-500">Matrix data not available</p>
				</div>
			{/if}
		</div>
	</div>
</div>
