<script lang="ts">
	import { goto } from '$app/navigation';
	import { technicalWritings } from '$lib/stores/technical-writings';
	import type { TechnicalWriting } from '$lib/api/types';
	import WritingTypeBadge from './WritingTypeBadge.svelte';
	import PlatformBadge from './PlatformBadge.svelte';

	let currentPage = 1;
	const itemsPerPage = 10;

	$: paginatedItems = $technicalWritings.items.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
	$: totalPages = Math.ceil($technicalWritings.items.length / itemsPerPage);

	async function handleDelete(id: string) {
		if (confirm('Are you sure you want to delete this writing?')) {
			await technicalWritings.deleteWriting(id);
		}
	}

	function handleEdit(id: string) {
		goto(`/technical-writings/${id}/edit`);
	}

	function handleView(id: string) {
		goto(`/technical-writings/${id}`);
	}
</script>

<div class="space-y-4">
	<div class="overflow-hidden rounded-lg bg-white shadow">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Title
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Type
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Platform
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Published
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Reading Time
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Topics
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Featured
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Actions
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 bg-white">
				{#each paginatedItems as writing (writing.id)}
					<tr class="hover:bg-gray-50">
						<td class="px-6 py-4 text-sm text-gray-900">
							<div class="max-w-xs truncate" title={writing.title}>{writing.title}</div>
							<div class="max-w-xs truncate text-xs text-gray-500">{writing.description}</div>
						</td>
						<td class="px-6 py-4 text-sm">
							<WritingTypeBadge type={writing.type} />
						</td>
						<td class="px-6 py-4 text-sm">
							<PlatformBadge platform={writing.platform} />
						</td>
						<td class="px-6 py-4 text-sm text-gray-900">
							{writing.publishedAt ? new Date(writing.publishedAt).toLocaleDateString() : '—'}
						</td>
						<td class="px-6 py-4 text-sm text-gray-900">
							{writing.readingTime ? `${writing.readingTime} min` : '—'}
						</td>
						<td class="px-6 py-4 text-sm text-gray-900">
							{#if writing.topics && writing.topics.length > 0}
								<div class="flex items-center gap-1">
									<span class="text-xs">
										{writing.topics.slice(0, 3).join(', ')}
										{#if writing.topics.length > 3}
											<span class="text-gray-500">+{writing.topics.length - 3}</span>
										{/if}
									</span>
								</div>
							{:else}
								<span class="text-gray-500">—</span>
							{/if}
						</td>
						<td class="px-6 py-4 text-center text-sm">
							{#if writing.featured}
								<span class="text-lg">⭐</span>
							{:else}
								<span class="text-gray-400">—</span>
							{/if}
						</td>
						<td class="px-6 py-4 text-sm font-medium">
							<div class="flex gap-2">
								<button
									on:click={() => handleView(writing.id)}
									class="text-blue-600 hover:text-blue-900"
									title="View"
								>
									👁️
								</button>
								<button
									on:click={() => handleEdit(writing.id)}
									class="text-indigo-600 hover:text-indigo-900"
									title="Edit"
								>
									✏️
								</button>
								<button
									on:click={() => handleDelete(writing.id)}
									class="text-red-600 hover:text-red-900"
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

	<!-- Pagination -->
	{#if totalPages > 1}
		<div class="flex items-center justify-between">
			<div class="text-sm text-gray-600">
				Page {currentPage} of {totalPages}
			</div>
			<div class="flex gap-2">
				<button
					on:click={() => currentPage--}
					disabled={currentPage === 1}
					class="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Previous
				</button>
				<button
					on:click={() => currentPage++}
					disabled={currentPage === totalPages}
					class="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Next
				</button>
			</div>
		</div>
	{/if}

	{#if paginatedItems.length === 0}
		<div class="rounded-lg bg-white py-12 text-center shadow">
			<p class="text-gray-500">No technical writings yet. Create one to get started!</p>
		</div>
	{/if}
</div>
