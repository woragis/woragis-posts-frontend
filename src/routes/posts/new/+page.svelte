<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { postsClient, auth } from '$lib';
	import { config } from '$lib/config';
	import { tokenCookies } from '$lib/api/auth/cookies';
	import DraftBuilder from '$lib/components/DraftBuilder.svelte';
	import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
	import { GenerationModal, AssetManager } from '$lib/components/assets';
	import type { Post } from '$lib/api/types';

	let title = '';
	let content = '';
	let excerpt = '';
	let slug = '';
	let status: 'draft' | 'published' = 'draft';
	let isSaving = false;
	let error = '';
	let activeTab: 'ai' | 'blank' | 'template' = 'ai';
	let createdPostId: string | null = null;
	let showAssetGeneration = false;

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
			return;
		}

		// Ensure CSRF token header is set by backend middleware
		const token = tokenCookies.getAccessToken();
		try {
			await fetch(`${config.postsApiUrl}/csrf-token`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
		} catch (err: any) {
			console.debug('CSRF token fetch completed (may have errors, but token should be set)');
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
			const post = await postsClient.createPost({
				title: title.trim(),
				content: content.trim(),
				excerpt: excerpt.trim(),
				slug: slug || generateSlug(title),
				status: 'draft'
			});

			createdPostId = post.id;
			showAssetGeneration = true;
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
			const post = await postsClient.createPost({
				title: title.trim(),
				content: content.trim(),
				excerpt: excerpt.trim(),
				slug: slug || generateSlug(title),
				status: 'published'
			});

			createdPostId = post.id;
			showAssetGeneration = true;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to publish post';
			isSaving = false;
		}
	}

	function handleAssetGenerationComplete() {
		showAssetGeneration = false;
		isSaving = false;
		// Navigate back to posts after a short delay
		setTimeout(() => {
			goto('/posts');
		}, 1500);
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<!-- Header -->
			<div class="mb-8">
				<a href="/posts" class="mb-4 block text-sm text-blue-600 hover:text-blue-500">
					← Back to Posts
				</a>
				<h1 class="text-3xl font-bold text-gray-900">Create New Post</h1>
			</div>

			{#if error}
				<div class="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
					<p class="text-sm text-red-700">{error}</p>
				</div>
			{/if}

			<!-- Tab Navigation -->
			<div class="mb-6 border-b border-gray-200">
				<div class="flex gap-8">
					<button
						on:click={() => (activeTab = 'ai')}
						class={`border-b-2 px-1 pb-4 text-sm font-medium transition ${
							activeTab === 'ai'
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
						}`}
					>
						AI Draft Builder
					</button>
					<button
						on:click={() => (activeTab = 'blank')}
						class={`border-b-2 px-1 pb-4 text-sm font-medium transition ${
							activeTab === 'blank'
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
						}`}
					>
						Blank Editor
					</button>
					<button
						on:click={() => (activeTab = 'template')}
						class={`border-b-2 px-1 pb-4 text-sm font-medium transition ${
							activeTab === 'template'
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
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
						<label for="title" class="mb-2 block text-sm font-medium text-gray-700">
							Title *
						</label>
						<input
							id="title"
							type="text"
							bind:value={title}
							on:change={handleTitleChange}
							placeholder="Article title"
							class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<!-- Slug -->
					<div>
						<label for="slug" class="mb-2 block text-sm font-medium text-gray-700">
							URL Slug
						</label>
						<input
							id="slug"
							type="text"
							bind:value={slug}
							placeholder="auto-generated from title"
							class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
						/>
						<p class="mt-1 text-xs text-gray-500">URL-friendly identifier</p>
					</div>

					<!-- Excerpt -->
					<div>
						<label for="excerpt" class="mb-2 block text-sm font-medium text-gray-700">
							Excerpt
						</label>
						<textarea
							id="excerpt"
							bind:value={excerpt}
							placeholder="Brief summary of the post (optional)"
							rows="2"
							class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
						></textarea>
					</div>

					<!-- Content Editor -->
					<div>
						<label for="content" class="mb-2 block text-sm font-medium text-gray-700">
							Content *
						</label>
						<MarkdownEditor bind:markdown={content} showPreview />
					</div>

					<!-- Status -->
					<div>
						<label for="status" class="mb-2 block text-sm font-medium text-gray-700">
							Status
						</label>
						<select
							id="status"
							bind:value={status}
							class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
						>
							<option value="draft">Draft</option>
							<option value="published">Published</option>
						</select>
					</div>

					<!-- Actions -->
					<div class="flex gap-4 pt-4">
						<a
							href="/posts"
							class="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</a>
						<button
							on:click={saveDraft}
							disabled={isSaving || !title.trim() || !content.trim()}
							class="rounded-lg bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isSaving ? 'Saving...' : 'Save as Draft'}
						</button>
						<button
							on:click={publish}
							disabled={isSaving || !title.trim() || !content.trim()}
							class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isSaving ? 'Publishing...' : 'Publish'}
						</button>
					</div>
				</div>
			{:else if activeTab === 'template'}
				<div class="rounded-lg bg-white p-6 shadow">
					<p class="text-gray-600">Templates coming soon...</p>
				</div>
			{/if}

			<!-- Asset Generation Modal -->
			{#if showAssetGeneration && createdPostId}
				<!-- Modal Backdrop -->
				<div
					class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
					role="dialog"
					tabindex="-1"
					aria-label="Generate Assets"
					on:click={(e) => {
						if (e.target === e.currentTarget) {
							handleAssetGenerationComplete();
						}
					}}
					on:keydown={(e) => {
						if (e.key === 'Escape') {
							handleAssetGenerationComplete();
						}
					}}
				>
					<div
						class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
					>
						<div class="mb-6">
							<h2 class="text-2xl font-bold text-gray-900">✨ Generate Post Assets</h2>
							<p class="mt-2 text-gray-600">
								Create thumbnail, featured image, and OG image automatically based on your post
								content.
							</p>
						</div>

						<!-- Quick Generate Buttons -->
						<div class="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
							<GenerationModal postId={createdPostId} assetType="thumbnail" />
							<GenerationModal postId={createdPostId} assetType="featured-image" />
							<GenerationModal postId={createdPostId} assetType="og-image" />
						</div>

						<!-- Asset Manager -->
						<div class="mb-6 rounded-lg bg-gray-50 p-4">
							<h3 class="mb-4 font-semibold text-gray-900">Generated Assets</h3>
							<AssetManager postId={createdPostId} />
						</div>

						<!-- Actions -->
						<div class="flex justify-end gap-3 border-t border-gray-200 pt-6">
							<button
								on:click={handleAssetGenerationComplete}
								class="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
							>
								Done
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
