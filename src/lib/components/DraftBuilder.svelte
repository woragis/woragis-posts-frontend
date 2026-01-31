<script lang="ts">
	import { aiClient, type Agent } from '$lib/api/ai';
	import StreamingTextDisplay from './StreamingTextDisplay.svelte';

	export let onDraftAccepted: (draft: string) => void = () => {};

	let context = '';
	let agent: Agent = 'auto';
	let temperature = 0.7;
	let isLoading = false;
	let streamContent = '';
	let error = '';
	let controller: AbortController | null = null;

	const agents: Agent[] = ['auto', 'entrepreneur', 'strategist', 'economist', 'startup'];

	async function generateDraft() {
		if (!context.trim()) {
			error = 'Please provide article context';
			return;
		}

		isLoading = true;
		streamContent = '';
		error = '';
		controller = new AbortController();

		try {
			const systemPrompt =
				'You are a professional content writer. Generate a well-structured article based on the provided context. ' +
				'Start directly with the content, no preamble. Format with clear sections, use Markdown formatting for emphasis and structure.';

			for await (const chunk of aiClient.chatStream(agent, context, {
				system: systemPrompt,
				temperature
			})) {
				// Check if generation was cancelled
				if (controller?.signal.aborted) {
					break;
				}

				if (chunk.error) {
					error = chunk.error;
					isLoading = false;
					return;
				}

				if (chunk.delta) {
					streamContent += chunk.delta;
				}

				if (chunk.done) {
					isLoading = false;
				}
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to generate draft';
			isLoading = false;
		}
	}

	function cancelGeneration() {
		controller?.abort();
		isLoading = false;
	}

	function acceptDraft() {
		if (streamContent.trim()) {
			onDraftAccepted(streamContent);
		}
	}

	function regenerate() {
		generateDraft();
	}
</script>

<div class="space-y-4">
	<div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
		<h3 class="text-lg font-semibold text-gray-900 mb-4">AI Draft Builder</h3>

		<div class="space-y-4">
			<!-- Context Input -->
			<div>
				<label for="context" class="block text-sm font-medium text-gray-700 mb-2">
					Article Context or Brief
				</label>
				<textarea
					id="context"
					bind:value={context}
					placeholder="Describe the article you want to create. Include topic, key points, target audience, tone, etc."
					disabled={isLoading}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
					rows="5"
				></textarea>
				<p class="text-xs text-gray-500 mt-1">
					Example: "Write a beginner's guide to Go microservices. Cover basic concepts, best practices, and common pitfalls. Tone: friendly but professional."
				</p>
			</div>

			<!-- Settings Row -->
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="agent" class="block text-sm font-medium text-gray-700 mb-2">
						Agent Type
					</label>
					<select
						id="agent"
						bind:value={agent}
						disabled={isLoading}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
					>
						{#each agents as a}
							<option value={a}>{a}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="temperature" class="block text-sm font-medium text-gray-700 mb-2">
						Creativity ({temperature.toFixed(2)})
					</label>
					<input
						id="temperature"
						type="range"
						bind:value={temperature}
						min="0"
						max="1"
						step="0.1"
						disabled={isLoading}
						class="w-full accent-blue-600 disabled:opacity-50"
					/>
					<p class="text-xs text-gray-500 mt-1">
						{#if temperature < 0.3}
							Focused & deterministic
						{:else if temperature < 0.7}
							Balanced
						{:else}
							Creative & diverse
						{/if}
					</p>
				</div>
			</div>
		</div>

		<!-- Streaming Display -->
		<div class="mt-6">
			<label for="generated-content" class="block text-sm font-medium text-gray-700 mb-2">Generated Content</label>
			<div id="generated-content">
				<StreamingTextDisplay
					{isLoading}
					{streamContent}
					{error}
					onCancel={isLoading ? cancelGeneration : null}
				/>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="mt-6 flex gap-3">
			<button
				on:click={generateDraft}
				disabled={isLoading || !context.trim()}
				class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
			>
				{isLoading ? 'Generating...' : 'Generate Draft'}
			</button>

			{#if streamContent && !isLoading}
				<button
					on:click={regenerate}
					class="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium"
				>
					Regenerate
				</button>

				<button
					on:click={acceptDraft}
					class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
				>
					Use This Draft
				</button>
			{/if}
		</div>

		{#if error}
			<div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
				{error}
			</div>
		{/if}
	</div>
</div>
