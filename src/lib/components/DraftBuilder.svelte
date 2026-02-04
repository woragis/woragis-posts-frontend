<script lang="ts">
	import { postsClient } from '$lib/api/posts/client';
	import { auth } from '$lib/stores/auth';
	import StreamingTextDisplay from './StreamingTextDisplay.svelte';

	export let onDraftAccepted: (draft: string) => void = () => {};

	let prompt = '';
	let isLoading = false;
	let streamContent = '';
	let error = '';
	let generatedPostId = '';

	async function generateDraft() {
		if (!prompt.trim()) {
			error = 'Please provide a prompt';
			return;
		}

		if (!$auth?.isAuthenticated) {
			error = 'User not authenticated';
			return;
		}

		isLoading = true;
		streamContent = '';
		error = '';
		generatedPostId = '';

		try {
			const response = await postsClient.generatePostFromAI({
				prompt: prompt.trim()
			});

			if (response.postId) {
				generatedPostId = response.postId;
				streamContent = `Post generation started (ID: ${generatedPostId}). Checking for generated content...`;
				isLoading = false;

				// Poll for completion
				await pollForGeneration(response.postId);
			} else {
				error = 'Failed to start generation: No post ID returned';
				isLoading = false;
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to generate draft';
			isLoading = false;
		}
	}

	async function pollForGeneration(postId: string, maxAttempts = 30) {
		let attempts = 0;

		while (attempts < maxAttempts) {
			try {
				await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before polling

				const post = await postsClient.getPost(postId);

				if (post?.status === 'draft') {
					// Generation complete!
					streamContent = post.content || '';
					onDraftAccepted(streamContent);
					isLoading = false;
					return;
				} else if (post?.status === 'generating') {
					// Still generating, update UI
					streamContent = `Still generating... (attempt ${attempts + 1}/${maxAttempts})`;
				} else {
					streamContent = `Generation status: ${post?.status}`;
				}

				attempts++;
			} catch (err) {
				console.error('Error polling for generation:', err);
				attempts++;
			}
		}

		error = 'Generation took too long. Please check back later.';
		isLoading = false;
	}

	function regenerate() {
		generateDraft();
	}
</script>

<div class="space-y-4">
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<h3 class="mb-4 text-lg font-semibold text-gray-900">AI Draft Builder</h3>

		<div class="space-y-4">
			<!-- Prompt Input -->
			<div>
				<label for="prompt" class="mb-2 block text-sm font-medium text-gray-700">
					Article Prompt
				</label>
				<textarea
					id="prompt"
					bind:value={prompt}
					placeholder="Describe the article you want to create. Be specific about the topic, key points, audience, and tone."
					disabled={isLoading}
					class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
					rows="5"
				></textarea>
				<p class="mt-1 text-xs text-gray-500">
					Example: "Write a technical article comparing RabbitMQ vs HTTP for microservices. Target
					audience: backend developers. Include trade-offs and when to use each."
				</p>
			</div>
		</div>

		<!-- Streaming Display -->
		<div class="mt-6">
			<label for="generated-content" class="mb-2 block text-sm font-medium text-gray-700"
				>Generated Content</label
			>
			<div id="generated-content">
				<StreamingTextDisplay
					{isLoading}
					{streamContent}
					{error}
					onCancel={isLoading
						? () => {
								isLoading = false;
							}
						: null}
				/>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="mt-6 flex gap-3">
			{#if streamContent && !isLoading}
				<button
					on:click={regenerate}
					class="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-900 hover:bg-gray-300"
				>
					Regenerate
				</button>

				<button
					on:click={() => onDraftAccepted(streamContent)}
					class="flex-1 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
				>
					Use This Draft
				</button>
			{:else}
				<button
					on:click={generateDraft}
					disabled={isLoading || !prompt.trim()}
					class="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isLoading ? 'Generating...' : 'Generate Post'}
				</button>
			{/if}
		</div>

		{#if error}
			<div class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
				{error}
			</div>
		{/if}
	</div>
</div>
