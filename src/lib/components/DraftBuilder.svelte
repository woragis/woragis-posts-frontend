<script lang="ts">
	import { aiClient, type Agent } from '$lib/api/ai';
	import { auth } from '$lib/stores/auth';
	import EnhancedStreamingDisplay from './EnhancedStreamingDisplay.svelte';
	import StreamingTextDisplay from './StreamingTextDisplay.svelte';

	export let onDraftAccepted: (draft: string) => void = () => {};
	export let postId: string | undefined = undefined;

	let context = '';
	let agent: Agent = 'auto';
	let isLoading = false;
	let streamContent = '';
	let error = '';
	let controller: AbortController | null = null;
	let tone: 'formal' | 'casual' | 'technical' | 'friendly' = 'friendly';
	let length: 'short' | 'medium' | 'long' = 'medium';
	let showPresets = false;

	const agents: Agent[] = ['auto', 'entrepreneur', 'strategist', 'economist', 'startup'];

	const contextTemplates = {
		technology: "Topic: [Software Technology]\nKey Points: [Core concepts, implementation details]\nTarget Audience: [Developers/Engineers]\nTone: Technical, clear explanations\nLength: [Specify desired length]",
		business: "Topic: [Business Strategy/Insight]\nKey Points: [Main argument, supporting data]\nTarget Audience: [Business professionals]\nTone: Professional, data-driven\nLength: [Specify desired length]",
		tutorial: "Topic: [Tutorial Subject]\nStep-by-step Process: [Outline steps]\nTarget Audience: [Beginners/Intermediate]\nPrerequisites: [What readers need to know]\nLength: [Specify desired length]",
		case_study: "Project/Company: [Name]\nChallenge: [Problem statement]\nSolution: [Approach taken]\nResults: [Outcomes and metrics]\nKey Learnings: [Takeaways]",
		thought_leadership: "Topic: [Industry Insight]\nCurrent Situation: [Context]\nFuture Vision: [Where this is heading]\nCall to Action: [What readers should do]\nTone: Authoritative, visionary"
	};

	function insertTemplate(template: string) {
		context = template;
		showPresets = false;
	}

	function applyToneToPrompt() {
		const toneDescriptions = {
			formal: "Use a formal, professional tone throughout.",
			casual: "Use a casual, conversational tone.",
			technical: "Use technical terminology and detailed explanations.",
			friendly: "Use a friendly, approachable tone."
		};

		const lengthHints = {
			short: "Keep it concise, around 300-500 words.",
			medium: "Medium length, around 800-1200 words.",
			long: "Comprehensive piece, around 1500-2500 words."
		};

		return `${context}\n\n[Writing Style: ${toneDescriptions[tone]}]\n[${lengthHints[length]}]`;
	}

	async function generateDraft() {
		if (!context.trim()) {
			error = 'Please provide article context';
			return;
		}

		let authState: any;
		auth.subscribe(state => authState = state);

		if (!authState?.user?.id) {
			error = 'User not authenticated';
			return;
		}

		isLoading = true;
		streamContent = '';
		error = '';
		controller = new AbortController();

		try {
			const fullPrompt = applyToneToPrompt();
			for await (const chunk of aiClient.generateDraftStream(
				authState.user.id,
				fullPrompt,
				agent,
				postId
			)) {
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

	function copyToClipboard() {
		navigator.clipboard.writeText(streamContent);
	}

	$: charCount = context.length;
</script>

<div class="space-y-4">
	<div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
		<h3 class="text-lg font-semibold text-gray-900 mb-4">AI Draft Builder</h3>

		<div class="space-y-4">
			<!-- Context Input with Templates -->
			<div>
				<div class="flex justify-between items-center mb-2">
					<label for="context" class="block text-sm font-medium text-gray-700">
						Article Context or Brief
					</label>
					<button
						type="button"
						on:click={() => (showPresets = !showPresets)}
						class="text-xs text-blue-600 hover:text-blue-700 font-medium"
					>
						{showPresets ? 'Hide' : 'Show'} Templates
					</button>
				</div>

				{#if showPresets}
					<div class="mb-3 grid grid-cols-2 gap-2 md:grid-cols-5 p-3 bg-blue-50 rounded-lg border border-blue-200">
						{#each Object.entries(contextTemplates) as [key, template]}
							<button
								type="button"
								on:click={() => insertTemplate(template)}
								class="px-2 py-2 text-xs font-medium bg-white border border-gray-300 rounded hover:bg-blue-50 transition"
								title={key}
							>
								{key.replace('_', ' ')}
							</button>
						{/each}
					</div>
				{/if}

				<textarea
					id="context"
					bind:value={context}
					placeholder="Describe the article you want to create. Include topic, key points, target audience, tone, etc."
					disabled={isLoading}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 font-mono text-sm"
					rows="6"
				></textarea>
				<div class="mt-1 flex justify-between items-center">
					<p class="text-xs text-gray-500">
						Example: "Write a beginner's guide to Go microservices. Cover basic concepts, best practices..."
					</p>
					<p class="text-xs text-gray-400">
						{charCount} characters
					</p>
				</div>
			</div>

			<!-- Settings: Agent, Tone, Length -->
			<div class="grid grid-cols-3 gap-4">
				<div>
					<label for="agent" class="block text-sm font-medium text-gray-700 mb-2">
						Agent Type
					</label>
					<select
						id="agent"
						bind:value={agent}
						disabled={isLoading}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-sm"
					>
						{#each agents as a}
							<option value={a}>{a}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="tone" class="block text-sm font-medium text-gray-700 mb-2">
						Tone
					</label>
					<select
						id="tone"
						bind:value={tone}
						disabled={isLoading}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-sm"
					>
						<option value="formal">Formal</option>
						<option value="casual">Casual</option>
						<option value="technical">Technical</option>
						<option value="friendly">Friendly</option>
					</select>
				</div>

				<div>
					<label for="length" class="block text-sm font-medium text-gray-700 mb-2">
						Length
					</label>
					<select
						id="length"
						bind:value={length}
						disabled={isLoading}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-sm"
					>
						<option value="short">Short (300-500w)</option>
						<option value="medium">Medium (800-1200w)</option>
						<option value="long">Long (1500-2500w)</option>
					</select>
				</div>
			</div>
		</div>

		<!-- Streaming Display -->
		<div class="mt-6">
			<div class="flex justify-between items-center mb-2">
				<label for="generated-output" class="block text-sm font-medium text-gray-700">Generated Content</label>
				{#if streamContent && !isLoading}
					<button
						type="button"
						on:click={copyToClipboard}
						class="text-xs text-gray-600 hover:text-gray-900 font-medium"
						title="Copy to clipboard"
					>
						📋 Copy
					</button>
				{/if}
			</div>
			<div id="generated-output">
				<EnhancedStreamingDisplay
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
				class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition"
			>
				{isLoading ? 'Generating...' : 'Generate Draft'}
			</button>

			{#if streamContent && !isLoading}
				<button
					on:click={regenerate}
					type="button"
					class="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium text-sm transition"
				>
					🔄 Regenerate
				</button>

				<button
					on:click={acceptDraft}
					type="button"
					class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition"
				>
					✓ Use Draft
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
