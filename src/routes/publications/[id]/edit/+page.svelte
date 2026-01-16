<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { publicationsClient } from '$lib/api/publications/client';
	import { auth } from '$lib';
	import { goto } from '$app/navigation';
	import type { Publication, UpdatePublicationRequest } from '$lib/api/types';

	let publication: Publication | null = null;
	let isLoading = true;
	let isSaving = false;
	let error = '';

	// Form data
	let title = '';
	let outline = '';
	let status: string = 'skeleton';
	let isArchived = false;

	const statuses = ['skeleton', 'draft', 'scheduled', 'published', 'archived'];

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
			return;
		}

		const pubId = $page.params.id;
		if (pubId) {
			await loadPublication(pubId);
		} else {
			error = 'Publication ID not found';
			isLoading = false;
		}
	});

	async function loadPublication(id: string) {
		isLoading = true;
		error = '';

		try {
			publication = await publicationsClient.getPublication(id);
			title = publication.title;
			outline = publication.outline || '';
			status = publication.status;
			isArchived = publication.isArchived;
		} catch (err: any) {
			error = err.message || 'Failed to load publication';
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmit() {
		if (!title.trim()) {
			error = 'Title is required';
			return;
		}

		if (!publication) {
			error = 'Publication not found';
			return;
		}

		isSaving = true;
		error = '';

		try {
			const updateData: UpdatePublicationRequest = {
				title,
				outline: outline || undefined,
				status: status as any,
				isArchived
			};

			await publicationsClient.updatePublication(publication.id, updateData);
			await goto(`/publications/${publication.id}`);
		} catch (err: any) {
			error = err.message || 'Failed to save publication';
		} finally {
			isSaving = false;
		}
	}

	async function handleDelete() {
		if (!publication) return;

		if (!confirm('Are you sure you want to delete this publication? This cannot be undone.')) {
			return;
		}

		isSaving = true;
		error = '';

		try {
			await publicationsClient.deletePublication(publication.id);
			await goto('/publications');
		} catch (err: any) {
			error = err.message || 'Failed to delete publication';
			isSaving = false;
		}
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-2xl">
	<div class="mb-6">
		<button
			on:click={() => goto(`/publications/${$page.params.id}`)}
			class="text-blue-600 hover:text-blue-800 font-medium"
		>
			← Back to Publication
		</button>
	</div>

	<div class="bg-white rounded-lg shadow p-6">
		<h1 class="text-3xl font-bold mb-6">Edit Publication</h1>

		{#if error}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
				{error}
			</div>
		{/if}

		{#if isLoading}
			<div class="text-center py-8">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
			</div>
		{:else}
			<form on:submit|preventDefault={handleSubmit}>
				<!-- Title -->
				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
					<input
						type="text"
						bind:value={title}
						placeholder="Publication title"
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<!-- Outline -->
				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-700 mb-2">Outline</label>
					<textarea
						bind:value={outline}
						placeholder="Brief outline or summary"
						rows="4"
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<!-- Status -->
				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
					<select
						bind:value={status}
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						{#each statuses as s}
							<option value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
						{/each}
					</select>
					<p class="text-xs text-gray-500 mt-1">
						skeleton → draft → scheduled → published → archived
					</p>
				</div>

				<!-- Archive Status -->
				<div class="mb-6">
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={isArchived}
							class="w-4 h-4 rounded border-gray-300"
						/>
						<span class="text-sm font-medium text-gray-700">Archive this publication</span>
					</label>
				</div>

				<!-- Buttons -->
				<div class="flex gap-4">
					<button
						type="submit"
						disabled={isSaving}
						class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSaving ? 'Saving...' : 'Update Publication'}
					</button>

					<button
						type="button"
						on:click={handleDelete}
						disabled={isSaving}
						class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Delete
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		background-color: #f9fafb;
	}
</style>
