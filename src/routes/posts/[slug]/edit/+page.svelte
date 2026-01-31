<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { postsClient, auth, aiClient } from '$lib';
	import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
	import StreamingTextDisplay from '$lib/components/StreamingTextDisplay.svelte';

	let post: any = null;
	let isLoading = true;
	let isSaving = false;
	let error = '';

	// Edit state
	let title = '';
	let content = '';
	let excerpt = '';
	let slug = '';
	let status: 'draft' | 'published' = 'draft';

	// AI improvement state
	let showImprovePanel = false;
	let improveRequest = '';
	let isImproving = false;
	let improveStreamContent = '';
	let improveError = '';
	let improveController: AbortController | null = null;

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
			return;
		}

		const slug = $page.params.slug as string;

		try {
			post = await postsClient.getPostBySlug(slug);
			title = post.title;
			content = post.content;
			excerpt = post.excerpt || '';
			slug = post.slug;
			status = post.status;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load post';
		} finally {
			isLoading = false;
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
	}

	async function improveContent() {
		if (!improveRequest.trim()) {
			improveError = 'Please describe what you want to improve';
			return;
		}

		isImproving = true;
		improveStreamContent = '';
		improveError = '';
		improveController = new AbortController();

		try {
			const systemPrompt =
				'You are an expert content editor. Improve the following article based on the user request. ' +
				'Return only the improved markdown content, no explanation or preamble.';

			const userInput =
				`Original content:\n\n${content}\n\n` +
				`Improvement request: ${improveRequest}`;

			for await (const chunk of aiClient.chatStream('auto', userInput, {
				system: systemPrompt,
				temperature: 0.7
			})) {
				if (improveController?.signal.aborted) {
					break;
				}

				if (chunk.error) {
					improveError = chunk.error;
					isImproving = false;
					return;
				}

				if (chunk.delta) {
					improveStreamContent += chunk.delta;
				}

				if (chunk.done) {
					isImproving = false;
				}
			}
		} catch (err) {
			improveError = err instanceof Error ? err.message : 'Failed to improve content';
			isImproving = false;
		}
	}

	function acceptImprovement() {
		if (improveStreamContent.trim()) {
			content = improveStreamContent;
			improveRequest = '';
			improveStreamContent = '';
			showImprovePanel = false;
		}
	}

	function cancelImprovement() {
		improveController?.abort();
		isImproving = false;
	}

	async function saveChanges() {
		if (!title.trim() || !content.trim()) {
			error = 'Title and content are required';
			return;
		}

		isSaving = true;
		error = '';

		try {
			await postsClient.updatePost(post.id, {
				title: title.trim(),
				content: content.trim(),
				excerpt: excerpt.trim(),
				slug,
				status
			});

			error = '';
			// Show success feedback (optional)
			setTimeout(() => {
				goto('/posts');
			}, 500);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save changes';
			isSaving = false;
		}
	}

	async function deletePost() {
		if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
			return;
		}

		try {
			await postsClient.deletePost(post.id);
			await goto('/posts');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to delete post';
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
				<h1 class="text-3xl font-bold text-gray-900">Edit Post</h1>
			</div>

			{#if error}
				<div class="rounded-md bg-red-50 p-4 mb-6 border border-red-200">
					<p class="text-sm text-red-700">{error}</p>
				</div>
			{/if}

			{#if isLoading}
				<div class="text-center py-12">
					<p class="text-gray-500">Loading post...</p>
				</div>
			{:else if post}
				<div class="space-y-6">
					<!-- Title -->
					<div>
						<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
							Title
						</label>
						<input
							id="title"
							type="text"
							bind:value={title}
							on:change={handleTitleChange}
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
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<!-- Excerpt -->
					<div>
						<label for="excerpt" class="block text-sm font-medium text-gray-700 mb-2">
							Excerpt
						</label>
						<textarea
							id="excerpt"
							bind:value={excerpt}
							rows="2"
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
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

					<!-- Content Editor -->
					<div>
						<div class="flex items-center justify-between mb-2">
							<label for="content" class="block text-sm font-medium text-gray-700">
								Content
							</label>
							<button
								on:click={() => (showImprovePanel = !showImprovePanel)}
								class="text-sm text-blue-600 hover:text-blue-700 font-medium"
							>
								{showImprovePanel ? 'Hide' : 'Show'} AI Improve
							</button>
						</div>
						<MarkdownEditor bind:markdown={content} showPreview />
					</div>

					<!-- AI Improve Panel -->
					{#if showImprovePanel}
						<div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 class="text-lg font-semibold text-blue-900 mb-4">AI Content Improvement</h3>

							<div class="space-y-4">
								<div>
									<label for="improve-request" class="block text-sm font-medium text-gray-700 mb-2">
										What would you like to improve?
									</label>
									<textarea
										id="improve-request"
										bind:value={improveRequest}
										placeholder="e.g., 'Make it more technical', 'Add more examples', 'Simplify for beginners', 'Add statistics and data'"
										disabled={isImproving}
										rows="3"
										class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
									/>
								</div>

								<!-- Streaming Display -->
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-2">Improved Content</label>
									<StreamingTextDisplay
										isLoading={isImproving}
										streamContent={improveStreamContent}
										error={improveError}
										onCancel={isImproving ? cancelImprovement : null}
									/>
								</div>

								<!-- Action Buttons -->
								<div class="flex gap-3">
									<button
										on:click={improveContent}
										disabled={isImproving || !improveRequest.trim()}
										class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
									>
										{isImproving ? 'Improving...' : 'Improve with AI'}
									</button>

									{#if improveStreamContent && !isImproving}
										<button
											on:click={acceptImprovement}
											class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
										>
											Accept Changes
										</button>
									{/if}
								</div>
							</div>
						</div>
					{/if}

					<!-- Save/Delete Actions -->
					<div class="flex gap-4 pt-4 border-t border-gray-200">
						<a
							href="/posts"
							class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
						>
							Cancel
						</a>
						<button
							on:click={saveChanges}
							disabled={isSaving}
							class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
						>
							{isSaving ? 'Saving...' : 'Save Changes'}
						</button>
						<button
							on:click={deletePost}
							class="ml-auto px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium"
						>
							Delete
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
