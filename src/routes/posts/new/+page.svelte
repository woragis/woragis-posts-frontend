<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { postsClient, auth } from '$lib';
	import DraftBuilder from '$lib/components/DraftBuilder.svelte';
	import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
	import type { Post } from '$lib/api/types';

	let title = '';
	let content = '';
	let excerpt = '';
	let slug = '';
	let status: 'draft' | 'published' = 'draft';
	let isSaving = false;
	let error = '';
	let activeTab: 'ai' | 'blank' | 'template' = 'ai';

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
		}
	});

	function generateSlug(titleText: string): string {
		return titleText
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-');
	}

	function handleTitleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		title = target.value;
		if (!slug || slug === generateSlug(title.slice(0, -1))) {
			slug = generateSlug(title);
		}
	}

	function handleDraftAccepted(draft: string) {
		content = draft;
		activeTab = 'blank';
		// Scroll to editor
		document.querySelector('[data-editor]')?.scrollIntoView({ behavior: 'smooth' });
	}

	async function saveDraft() {
		if (!title.trim() || !content.trim()) {
			error = 'Title and content are required';
			return;
		}

		isSaving = true;
		error = '';

		try {
			await postsClient.createPost({
				title: title.trim(),
				content: content.trim(),
				excerpt: excerpt.trim(),
				slug: slug || generateSlug(title),
				status: 'draft'
			});

			await goto('/posts');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save draft';
			isSaving = false;
		}
	}

	async function publish() {
		if (!title.trim() || !content.trim()) {
			error = 'Title and content are required';
			return;
		}

		isSaving = true;
		error = '';

		try {
			await postsClient.createPost({
				title: title.trim(),
				content: content.trim(),
				excerpt: excerpt.trim(),
				slug: slug || generateSlug(title),
				status: 'published'
			});

			await goto('/posts');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to publish post';
			isSaving = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<!-- Header -->
			<div class="mb-8">
				<a href="/posts" class="text-blue-600 hover:text-blue-500 text-sm mb-4 block">
					← Back to Posts
				</a>
				<h1 class="text-3xl font-bold text-gray-900">Create New Post</h1>
			</div>

			{#if error}
				<div class="rounded-md bg-red-50 p-4 mb-6 border border-red-200">
					<p class="text-sm text-red-700">{error}</p>
				</div>
			{/if}

			<!-- Tab Navigation -->
			<div class="mb-6 border-b border-gray-200">
				<div class="flex gap-8">
					<button
						on:click={() => (activeTab = 'ai')}
						class={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
							activeTab === 'ai'
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
						}`}
					>
						AI Draft Builder
					</button>
					<button
						on:click={() => (activeTab = 'blank')}
						class={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
							activeTab === 'blank'
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
						}`}
					>
						Blank Editor
					</button>
					<button
						on:click={() => (activeTab = 'template')}
						class={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
							activeTab === 'template'
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
						}`}
					>
						Templates
					</button>
				</div>
			</div>

			<!-- Tab Content -->
			{#if activeTab === 'ai'}
				<DraftBuilder onDraftAccepted={handleDraftAccepted} />
			{:else if activeTab === 'blank'}
				<div data-editor class="space-y-6">
					<!-- Title -->
					<div>
						<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
							Title *
						</label>
						<input
							id="title"
							type="text"
							bind:value={title}
							on:change={handleTitleChange}
							placeholder="Article title"
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<!-- Slug -->
					<div>
						<label for="slug" class="block text-sm font-medium text-gray-700 mb-2">
							URL Slug
						</label>
						<input
							id="slug"
							type="text"
							bind:value={slug}
							placeholder="auto-generated from title"
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<p class="text-xs text-gray-500 mt-1">URL-friendly identifier</p>
					</div>

					<!-- Excerpt -->
					<div>
						<label for="excerpt" class="block text-sm font-medium text-gray-700 mb-2">
							Excerpt
						</label>
						<textarea
							id="excerpt"
							bind:value={excerpt}
							placeholder="Brief summary of the post (optional)"
							rows="2"
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<!-- Content Editor -->
					<div>
						<label for="content" class="block text-sm font-medium text-gray-700 mb-2">
							Content *
						</label>
						<MarkdownEditor bind:markdown={content} showPreview />
					</div>

					<!-- Status -->
					<div>
						<label for="status" class="block text-sm font-medium text-gray-700 mb-2">
							Status
						</label>
						<select
							id="status"
							bind:value={status}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="draft">Draft</option>
							<option value="published">Published</option>
						</select>
					</div>

					<!-- Actions -->
					<div class="flex gap-4 pt-4">
						<a
							href="/posts"
							class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
						>
							Cancel
						</a>
						<button
							on:click={saveDraft}
							disabled={isSaving || !title.trim() || !content.trim()}
							class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
						>
							{isSaving ? 'Saving...' : 'Save as Draft'}
						</button>
						<button
							on:click={publish}
							disabled={isSaving || !title.trim() || !content.trim()}
							class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
						>
							{isSaving ? 'Publishing...' : 'Publish'}
						</button>
					</div>
				</div>
			{:else if activeTab === 'template'}
				<div class="bg-white rounded-lg shadow p-6">
					<p class="text-gray-600">Templates coming soon...</p>
				</div>
			{/if}
		</div>
	</div>
</div>
