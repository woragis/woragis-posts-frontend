<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		caseStudies,
		loadCaseStudies,
		searchCaseStudies,
		deleteCaseStudy
	} from '$lib/stores/case-studies';
	import type { CaseStudy } from '$lib/api/types';

	let searchInput = '';
	let selectedStatus: 'all' | 'draft' | 'published' = 'all';
	let isDeleting: Record<string, boolean> = {};

	$: {
		if (searchInput.trim()) {
			searchCaseStudies(searchInput);
		} else if ($caseStudies.searchQuery) {
			loadCaseStudies();
		}
	}

	function handleStatusChange() {
		loadCaseStudies();
	}

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this case study?')) return;

		isDeleting[id] = true;
		const success = await deleteCaseStudy(id);
		isDeleting[id] = false;

		if (success) {
			// Component will automatically update via store
		}
	}

	function handleEdit(caseStudy: CaseStudy) {
		goto(`/case-studies/${caseStudy.id}/edit`);
	}

	function handleView(caseStudy: CaseStudy) {
		goto(`/case-studies/${caseStudy.id}`);
	}

	function nextPage() {
		if ($caseStudies.currentPage < $caseStudies.totalPages) {
			loadCaseStudies($caseStudies.currentPage + 1);
		}
	}

	function prevPage() {
		if ($caseStudies.currentPage > 1) {
			loadCaseStudies($caseStudies.currentPage - 1);
		}
	}
</script>

<div class="rounded-lg bg-white shadow">
	{#if $caseStudies.error}
		<div class="mb-4 rounded-md bg-red-50 p-4">
			<p class="text-sm text-red-700">{$caseStudies.error}</p>
		</div>
	{/if}

	<div class="border-b border-gray-200 px-6 py-4">
		<div class="flex flex-col gap-4">
			<div class="flex gap-4">
				<input
					type="text"
					placeholder="Search case studies..."
					bind:value={searchInput}
					class="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
				/>
				<select
					bind:value={selectedStatus}
					on:change={handleStatusChange}
					class="rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
				>
					<option value="all">All Status</option>
					<option value="draft">Draft</option>
					<option value="published">Published</option>
				</select>
			</div>
		</div>
	</div>

	{#if $caseStudies.isLoading}
		<div class="px-6 py-12 text-center">
			<p class="text-gray-500">Loading case studies...</p>
		</div>
	{:else if $caseStudies.items.length === 0}
		<div class="px-6 py-12 text-center">
			<p class="mb-4 text-gray-500">No case studies found</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Title</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Status</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Created</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Actions</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each $caseStudies.items as caseStudy (caseStudy.id)}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
								{caseStudy.title}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap">
								<span
									class="inline-flex rounded-full px-2 py-1 text-xs font-semibold"
									class:bg-yellow-100={caseStudy.status === 'draft'}
									class:text-yellow-800={caseStudy.status === 'draft'}
									class:bg-green-100={caseStudy.status === 'published'}
									class:text-green-800={caseStudy.status === 'published'}
								>
									{caseStudy.status || 'draft'}
								</span>
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{new Date(caseStudy.createdAt || '').toLocaleDateString()}
							</td>
							<td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
								<button
									on:click={() => handleView(caseStudy)}
									class="mr-4 text-blue-600 hover:text-blue-900"
								>
									View
								</button>
								<button
									on:click={() => handleEdit(caseStudy)}
									class="mr-4 text-blue-600 hover:text-blue-900"
								>
									Edit
								</button>
								<button
									on:click={() => handleDelete(caseStudy.id)}
									disabled={isDeleting[caseStudy.id]}
									class="text-red-600 hover:text-red-900 disabled:opacity-50"
								>
									{isDeleting[caseStudy.id] ? 'Deleting...' : 'Delete'}
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="flex items-center justify-between border-t border-gray-200 px-6 py-4">
			<div class="text-sm text-gray-600">
				Page {$caseStudies.currentPage} of {$caseStudies.totalPages}
			</div>
			<div class="flex gap-2">
				<button
					on:click={prevPage}
					disabled={$caseStudies.currentPage === 1}
					class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
				>
					Previous
				</button>
				<button
					on:click={nextPage}
					disabled={$caseStudies.currentPage >= $caseStudies.totalPages}
					class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
				>
					Next
				</button>
			</div>
		</div>
	{/if}
</div>
