<script lang="ts">
	import { systemDesigns } from '$lib/stores/system-designs';
	import SystemDesignBadge from './SystemDesignBadge.svelte';
	import { goto } from '$app/navigation';

	let currentPage = 1;
	const itemsPerPage = 10;

	$: paginatedItems = $systemDesigns.items.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
	$: totalPages = Math.ceil($systemDesigns.items.length / itemsPerPage);
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold text-gray-900">System Designs</h2>
		<button
			on:click={() => goto('/system-designs/new')}
			class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
		>
			+ New Design
		</button>
	</div>

	<div class="overflow-x-auto rounded-lg border border-gray-200">
		<table class="w-full">
			<thead>
				<tr class="border-b bg-gray-50">
					<th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
					<th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
					<th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
					<th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Featured</th>
					<th class="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each paginatedItems as design (design.id)}
					<tr class="border-b hover:bg-gray-50">
						<td class="px-6 py-4">
							<div class="flex items-center gap-2">
								<SystemDesignBadge title="System Design" />
								<span class="font-medium text-gray-900">{design.title}</span>
							</div>
						</td>
						<td class="px-6 py-4 text-sm text-gray-600">
							{design.description.substring(0, 60)}...
						</td>
						<td class="px-6 py-4 text-sm text-gray-600">
							{new Date(design.createdAt).toLocaleDateString()}
						</td>
						<td class="px-6 py-4 text-sm">
							{design.featured ? '⭐' : '-'}
						</td>
						<td class="px-6 py-4 text-right text-sm">
							<button
								on:click={() => goto(`/system-designs/${design.id}/edit`)}
								class="mr-2 text-blue-600 hover:text-blue-900"
							>
								✏️ Edit
							</button>
							<button
								on:click={() => goto(`/system-designs/${design.id}`)}
								class="mr-2 text-gray-600 hover:text-gray-900"
							>
								👁️ View
							</button>
							<button
								on:click={async () => {
									if (confirm('Delete this system design?')) {
										await systemDesigns.deleteSystemDesign(design.id);
									}
								}}
								class="text-red-600 hover:text-red-900"
							>
								🗑️ Delete
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if totalPages > 1}
		<div class="flex items-center justify-center gap-2">
			<button
				disabled={currentPage === 1}
				on:click={() => currentPage--}
				class="rounded px-3 py-1 disabled:opacity-50"
			>
				← Previous
			</button>
			<span class="text-sm text-gray-600">
				Page {currentPage} of {totalPages}
			</span>
			<button
				disabled={currentPage === totalPages}
				on:click={() => currentPage++}
				class="rounded px-3 py-1 disabled:opacity-50"
			>
				Next →
			</button>
		</div>
	{/if}
</div>
