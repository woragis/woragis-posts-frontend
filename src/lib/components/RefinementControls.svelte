<script lang="ts">
	import { aiClient, type Agent } from '$lib/api/ai';
	import { auth } from '$lib/stores/auth';
	import EnhancedStreamingDisplay from './EnhancedStreamingDisplay.svelte';

	export let content: string = '';
	export let agent: Agent = 'auto';
	export let postId: string | undefined = undefined;
	export let onContentUpdated: (newContent: string) => void = () => {};

	let refinementType: 'expand' | 'simplify' | 'technical' | 'tone_casual' | 'tone_formal' | 'improve' | 'custom' = 'expand';
	let customRefinementPrompt = '';
	let isRefining = false;
	let refinedContent = '';
	let error = '';
	let controller: AbortController | null = null;
	let showRefinementUI = false;

	const refinementOptions = [
		{ value: 'expand', label: '📈 Expand', description: 'Add more detail and depth' },
		{ value: 'simplify', label: '📉 Simplify', description: 'Make it more concise' },
		{ value: 'technical', label: '🔧 Technical', description: 'Add technical details' },
		{ value: 'tone_casual', label: '😊 Casual', description: 'More conversational' },
		{ value: 'tone_formal', label: '🎩 Formal', description: 'More professional' },
		{ value: 'improve', label: '✨ Polish', description: 'General improvement' },
		{ value: 'custom', label: '💭 Custom', description: 'Custom refinement' }
	];

	function buildRefinementPrompt(): string {
		const basePrompt = `Here is the current content:\n\n${content}\n\n`;

		const refinementPrompts = {
			expand: `Please expand this content with more details, examples, and in-depth explanations. Maintain the same tone and structure but add 30-50% more content.`,
			simplify: `Please simplify this content to be more concise and easier to understand. Maintain all key points but reduce unnecessary complexity. Target 20-30% word reduction.`,
			technical: `Please enhance this content with more technical details, specifics, and implementation details. Add technical terminology and practical code examples where relevant.`,
			tone_casual: `Please rewrite this content in a more casual, conversational tone. Make it friendly and approachable while maintaining accuracy.`,
			tone_formal: `Please rewrite this content in a more formal, professional tone. Make it suitable for business or academic contexts.`,
			improve: `Please review and improve this content. Fix any issues with clarity, flow, accuracy, and overall quality. Enhance it without changing the core message.`,
			custom: `${customRefinementPrompt}`
		};

		return basePrompt + (refinementPrompts[refinementType] || '');
	}

	async function performRefinement() {
		if (!content.trim()) {
			error = 'No content to refine';
			return;
		}

		if (refinementType === 'custom' && !customRefinementPrompt.trim()) {
			error = 'Please enter a custom refinement prompt';
			return;
		}

		let authState: any;
		auth.subscribe(state => authState = state);

		if (!authState?.user?.id) {
			error = 'User not authenticated';
			return;
		}

		isRefining = true;
		refinedContent = '';
		error = '';
		controller = new AbortController();

		try {
			const prompt = buildRefinementPrompt();
			for await (const chunk of aiClient.generateDraftStream(
				authState.user.id,
				prompt,
				agent,
				postId
			)) {
				if (controller?.signal.aborted) {
					break;
				}

				if (chunk.error) {
					error = chunk.error;
					isRefining = false;
					return;
				}

				if (chunk.delta) {
					refinedContent += chunk.delta;
				}

				if (chunk.done) {
					isRefining = false;
				}
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to refine content';
			isRefining = false;
		}
	}

	function applyRefinement() {
		if (refinedContent.trim()) {
			onContentUpdated(refinedContent);
			showRefinementUI = false;
			refinedContent = '';
			customRefinementPrompt = '';
		}
	}

	function cancelRefinement() {
		controller?.abort();
		isRefining = false;
		refinedContent = '';
	}

	function keepOriginal() {
		showRefinementUI = false;
		refinedContent = '';
		customRefinementPrompt = '';
	}
</script>

<div class="space-y-4">
	{#if !showRefinementUI}
		<button
			type="button"
			on:click={() => (showRefinementUI = true)}
			class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition"
		>
			✨ Refine Content
		</button>
	{:else}
		<div class="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
			<div class="flex justify-between items-center">
				<h4 class="font-semibold text-gray-900">Refinement Options</h4>
				<button
					type="button"
					on:click={keepOriginal}
					class="text-sm text-gray-600 hover:text-gray-900"
				>
					✕
				</button>
			</div>

			<!-- Refinement Type Selection -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-2">
				{#each refinementOptions as option}
					<button
						type="button"
						on:click={() => {
							refinementType = option.value as typeof refinementType;
						}}
						class={`p-2 rounded-lg border-2 text-sm transition ${
							refinementType === option.value
								? 'border-indigo-600 bg-indigo-50'
								: 'border-gray-300 hover:border-gray-400'
						}`}
						title={option.description}
					>
						<div class="font-medium">{option.label}</div>
						<div class="text-xs text-gray-600">{option.description}</div>
					</button>
				{/each}
			</div>

			<!-- Custom Refinement Input -->
			{#if refinementType === 'custom'}
				<div>
					<label for="custom-prompt" class="block text-sm font-medium text-gray-700 mb-2">
						Custom Refinement Instructions
					</label>
					<textarea
						id="custom-prompt"
						bind:value={customRefinementPrompt}
						placeholder="Describe how you want to refine the content..."
						disabled={isRefining}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 text-sm"
						rows="3"
					></textarea>
				</div>
			{/if}

			<!-- Generate Refinement Button -->
			<button
				type="button"
				on:click={performRefinement}
				disabled={isRefining}
				class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition"
			>
				{isRefining ? 'Refining...' : 'Generate Refinement'}
			</button>

			{#if error}
				<div class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
					{error}
				</div>
			{/if}

			<!-- Refined Content Display -->
			{#if refinedContent || isRefining}
				<div class="space-y-2">
					<h5 class="font-medium text-gray-900 text-sm">Refined Version:</h5>
					<EnhancedStreamingDisplay
						isLoading={isRefining}
						streamContent={refinedContent}
						error=""
						onCancel={isRefining ? cancelRefinement : null}
					/>

					{#if refinedContent && !isRefining}
						<div class="flex gap-2">
							<button
								type="button"
								on:click={applyRefinement}
								class="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition"
							>
								✓ Use This
							</button>
							<button
								type="button"
								on:click={performRefinement}
								class="flex-1 px-3 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium text-sm transition"
							>
								🔄 Regenerate
							</button>
							<button
								type="button"
								on:click={keepOriginal}
								class="flex-1 px-3 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium text-sm transition"
							>
								✕ Discard
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>
