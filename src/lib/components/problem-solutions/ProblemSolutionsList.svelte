<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		problemSolutions,
		loadProblemSolutions,
		deleteProblemSolution
	} from '$lib/stores/problem-solutions';
	import type { ProblemSolution } from '$lib/api/types';

	let isDeleting: Record<string, boolean> = {};

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this problem solution?')) return;

		isDeleting[id] = true;
		const success = await deleteProblemSolution(id);
		isDeleting[id] = false;

		if (success) {
			// Component will automatically update via store
		}
	}

	function handleEdit(ps: ProblemSolution) {
		goto(`/problem-solutions/${ps.id}/edit`);
	}

	function handleView(ps: ProblemSolution) {
		goto(`/problem-solutions/${ps.id}`);
	}

	function nextPage() {
		if ($problemSolutions.currentPage < $problemSolutions.totalPages) {
			loadProblemSolutions($problemSolutions.currentPage + 1);
		}
	}

	function prevPage() {
		if ($problemSolutions.currentPage > 1) {
			loadProblemSolutions($problemSolutions.currentPage - 1);
		}
	}
</script>

<div class="bg-white rounded-lg shadow">
	{#if $problemSolutions.error}
		<div class="rounded-md bg-red-50 p-4 mb-4">
			<p class="text-sm text-red-700">{$problemSolutions.error}</p>
		</div>
	{/if}

	{#if $problemSolutions.isLoading}
		<div class="px-6 py-12 text-center">
			<p class="text-gray-500">Loading problem solutions...</p>
		</div>
	{:else if $problemSolutions.items.length === 0}
		<div class="px-6 py-12 text-center">
			<p class="text-gray-500 mb-4">No problem solutions found</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technologies</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each $problemSolutions.items as ps (ps.id)}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 text-sm">
								<div class="font-medium text-gray-900 truncate max-w-xs">{ps.problem}</div>
								<p class="text-gray-500 text-xs truncate max-w-xs mt-1">{ps.context}</p>
							</td>
							<td class="px-6 py-4 text-sm">
								<div class="flex flex-wrap gap-1">
									{#each ps.technologies.slice(0, 3) as tech}
										<span class="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
											{tech}
										</span>
									{/each}
									{#if ps.technologies.length > 3}
										<span class="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
											+{ps.technologies.length - 3}
										</span>
									{/if}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm">
								{#if ps.featured}
									<span class="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
										★ Featured
									</span>
								{:else}
									<span class="text-gray-400 text-xs">—</span>
								{/if}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{new Date(ps.createdAt).toLocaleDateString()}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
								<button on:click={() => handleView(ps)} class="text-blue-600 hover:text-blue-900 mr-4">
									View
								</button>
								<button on:click={() => handleEdit(ps)} class="text-blue-600 hover:text-blue-900 mr-4">
									Edit
								</button>
								<button
									on:click={() => handleDelete(ps.id)}
									disabled={isDeleting[ps.id]}
									class="text-red-600 hover:text-red-900 disabled:opacity-50"
								>
									{isDeleting[ps.id] ? 'Deleting...' : 'Delete'}
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
			<div class="text-sm text-gray-600">
				Page {$problemSolutions.currentPage} of {$problemSolutions.totalPages}
			</div>
			<div class="flex gap-2">
				<button
					on:click={prevPage}
					disabled={$problemSolutions.currentPage === 1}
					class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
				>
					Previous
				</button>
				<button
					on:click={nextPage}
					disabled={$problemSolutions.currentPage >= $problemSolutions.totalPages}
					class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
				>
					Next
				</button>
			</div>
		</div>
	{/if}
</div>
