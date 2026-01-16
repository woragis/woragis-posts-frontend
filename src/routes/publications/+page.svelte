<script lang="ts">
	import { onMount } from 'svelte';
	import { publicationsClient } from '$lib/api/publications/client';
	import { auth } from '$lib';
	import { goto } from '$app/navigation';
	import type { Publication, PublicationStatus, ContentType } from '$lib/api/types';

	let publications: Publication[] = [];
	let isLoading = true;
	let error = '';
	let currentOffset = 0;
	const LIMIT = 20;

	// Filters
	let statusFilter: PublicationStatus | '' = '';
	let contentTypeFilter: ContentType | '' = '';
	let archivedFilter: boolean | null = null;

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
			return;
		}

		await loadPublications();
	});

	async function loadPublications() {
		isLoading = true;
		error = '';

		try {
			const response = await publicationsClient.listPublications({
				status: statusFilter || undefined,
				contentType: contentTypeFilter || undefined,
				isArchived: archivedFilter !== null ? archivedFilter : undefined,
				limit: LIMIT,
				offset: currentOffset
			});

			publications = response.data || [];
		} catch (err: any) {
			error = err.message || 'Failed to load publications';
		} finally {
			isLoading = false;
		}
	}

	function createNew() {
		goto('/publications/create');
	}

	function openPublication(id: string) {
		goto(`/publications/${id}`);
	}

	function handleStatusChange() {
		currentOffset = 0;
		loadPublications();
	}

	function resetFilters() {
		statusFilter = '';
		contentTypeFilter = '';
		archivedFilter = null;
		currentOffset = 0;
		loadPublications();
	}

	function nextPage() {
		currentOffset += LIMIT;
		loadPublications();
	}

	function prevPage() {
		if (currentOffset >= LIMIT) {
			currentOffset -= LIMIT;
			loadPublications();
		}
	}

	function getStatusBadgeColor(status: PublicationStatus): string {
		switch (status) {
			case 'skeleton':
				return 'bg-gray-200 text-gray-800';
			case 'draft':
				return 'bg-yellow-100 text-yellow-800';
			case 'scheduled':
				return 'bg-blue-100 text-blue-800';
			case 'published':
				return 'bg-green-100 text-green-800';
			case 'archived':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">Publications</h1>
		<button
			on:click={createNew}
			class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
		>
			+ New Publication
		</button>
	</div>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			{error}
		</div>
	{/if}

	<!-- Filters -->
	<div class="bg-white rounded-lg shadow p-4 mb-6">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<div>
				<label class="block text-sm font-medium mb-2">Status</label>
				<select
					bind:value={statusFilter}
					on:change={handleStatusChange}
					class="w-full px-3 py-2 border border-gray-300 rounded-md"
				>
					<option value="">All</option>
					<option value="skeleton">Skeleton</option>
					<option value="draft">Draft</option>
					<option value="scheduled">Scheduled</option>
					<option value="published">Published</option>
					<option value="archived">Archived</option>
				</select>
			</div>

			<div>
				<label class="block text-sm font-medium mb-2">Content Type</label>
				<select
					bind:value={contentTypeFilter}
					on:change={handleStatusChange}
					class="w-full px-3 py-2 border border-gray-300 rounded-md"
				>
					<option value="">All Types</option>
					<option value="post">Post</option>
					<option value="case_study">Case Study</option>
					<option value="problem_solution">Problem Solution</option>
					<option value="technical_writing">Technical Writing</option>
					<option value="system_design">System Design</option>
					<option value="report">Report</option>
					<option value="impact_metric">Impact Metric</option>
					<option value="aiml_integration">AI/ML Integration</option>
				</select>
			</div>

			<div>
				<label class="block text-sm font-medium mb-2">Archive Status</label>
				<select
					bind:value={archivedFilter}
					on:change={handleStatusChange}
					class="w-full px-3 py-2 border border-gray-300 rounded-md"
				>
					<option value="">All</option>
					<option value={false}>Active</option>
					<option value={true}>Archived</option>
				</select>
			</div>

			<div class="flex items-end">
				<button
					on:click={resetFilters}
					class="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
				>
					Reset Filters
				</button>
			</div>
		</div>
	</div>

	<!-- Publications List -->
	{#if isLoading}
		<div class="text-center py-8">
			<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
		</div>
	{:else if publications.length === 0}
		<div class="text-center py-8 bg-white rounded-lg">
			<p class="text-gray-500">No publications found</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each publications as pub (pub.id)}
				<div
					class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-4"
					on:click={() => openPublication(pub.id)}
				>
					<div class="flex justify-between items-start">
						<div class="flex-1">
							<h2 class="text-xl font-semibold text-gray-900">{pub.title}</h2>
							<p class="text-sm text-gray-500 mt-1">{pub.outline || 'No outline'}</p>
							<div class="flex gap-2 mt-3">
								<span class={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(pub.status)}`}>
									{pub.status}
								</span>
								<span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
									{pub.contentType}
								</span>
								{#if pub.isArchived}
									<span class="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium">
										Archived
									</span>
								{/if}
							</div>
						</div>
						<div class="text-right">
							<p class="text-sm text-gray-500">
								{new Date(pub.createdAt).toLocaleDateString()}
							</p>
							{#if pub.platforms && pub.platforms.length > 0}
								<p class="text-sm text-green-600 font-medium mt-2">
									Published on {pub.platforms.length} platform{pub.platforms.length > 1 ? 's' : ''}
								</p>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Pagination -->
		<div class="flex justify-center gap-4 mt-8">
			<button
				on:click={prevPage}
				disabled={currentOffset === 0}
				class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed"
			>
				← Previous
			</button>
			<span class="py-2 text-gray-600">
				Showing {currentOffset + 1} to {currentOffset + publications.length}
			</span>
			<button
				on:click={nextPage}
				disabled={publications.length < LIMIT}
				class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Next →
			</button>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		background-color: #f9fafb;
	}
</style>
