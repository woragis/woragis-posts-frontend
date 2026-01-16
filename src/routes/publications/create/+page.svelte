<script lang="ts">
	import { goto } from '$app/navigation';
	import { publicationsClient } from '$lib/api/publications/client';
	import { auth } from '$lib';
	import { onMount } from 'svelte';
	import type { CreatePublicationRequest, ContentType } from '$lib/api/types';

	let isSaving = false;
	let error = '';

	// Form data
	let title = '';
	let outline = '';
	let contentId = '';
	let contentType: ContentType = 'post';

	const contentTypes: ContentType[] = [
		'post',
		'case_study',
		'problem_solution',
		'technical_writing',
		'system_design',
		'report',
		'impact_metric',
		'aiml_integration'
	];

	onMount(() => {
		if (!$auth.isAuthenticated) {
			goto('/auth/login');
		}
	});

	async function handleSubmit() {
		if (!title.trim()) {
			error = 'Title is required';
			return;
		}

		if (!contentId.trim()) {
			error = 'Content ID is required';
			return;
		}

		isSaving = true;
		error = '';

		try {
			const data: CreatePublicationRequest = {
				contentId,
				contentType,
				title,
				outline: outline || undefined
			};

			const publication = await publicationsClient.createPublication(data);
			await goto(`/publications/${publication.id}`);
		} catch (err: any) {
			error = err.message || 'Failed to create publication';
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-2xl">
	<div class="mb-6">
		<button
			on:click={() => goto('/publications')}
			class="text-blue-600 hover:text-blue-800 font-medium"
		>
			← Back to Publications
		</button>
	</div>

	<div class="bg-white rounded-lg shadow p-6">
		<h1 class="text-3xl font-bold mb-6">Create New Publication</h1>

		{#if error}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
				{error}
			</div>
		{/if}

		<form on:submit|preventDefault={handleSubmit}>
			<!-- Title -->
			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
				<input
					type="text"
					bind:value={title}
					placeholder="Publication title"
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					required
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

			<!-- Content ID -->
			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700 mb-2">Content ID *</label>
				<input
					type="text"
					bind:value={contentId}
					placeholder="ID of the content being published"
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					required
				/>
				<p class="text-xs text-gray-500 mt-1">
					The ID of the post, case study, or other content you want to publish
				</p>
			</div>

			<!-- Content Type -->
			<div class="mb-6">
				<label class="block text-sm font-medium text-gray-700 mb-2">Content Type *</label>
				<select
					bind:value={contentType}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					required
				>
					{#each contentTypes as type}
						<option value={type}>
							{type
								.split('_')
								.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
								.join(' ')}
						</option>
					{/each}
				</select>
			</div>

			<!-- Submit Button -->
			<button
				type="submit"
				disabled={isSaving}
				class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isSaving ? 'Creating...' : 'Create Publication'}
			</button>
		</form>
	</div>
</div>

<style>
	:global(body) {
		background-color: #f9fafb;
	}
</style>
