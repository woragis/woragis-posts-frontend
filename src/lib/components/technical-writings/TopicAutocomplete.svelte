<script lang="ts">
	/**
	 * TopicAutocomplete Component
	 * A fancy tag input with autocomplete for topics/domains
	 */

	let inputValue = '';
	let open = false;

	export let selectedTopics: string[] = [];
	export let id: string = 'topic-autocomplete';

	const suggestedTopics = [
		'backend',
		'frontend',
		'devops',
		'architecture',
		'performance',
		'security',
		'testing',
		'database',
		'api',
		'cloud',
		'kubernetes',
		'docker',
		'aws',
		'azure',
		'gcp',
		'nodejs',
		'go',
		'rust',
		'python',
		'java',
		'typescript',
		'javascript',
		'react',
		'vue',
		'svelte',
		'angular',
		'next',
		'nuxt',
		'vite',
		'webpack',
		'graphql',
		'rest',
		'microservices',
		'serverless',
		'ai',
		'ml',
		'blockchain',
		'web3',
		'mobile',
		'ios',
		'android'
	];

	$: filtered = suggestedTopics
		.filter(
			(topic) =>
				!selectedTopics.includes(topic) && topic.toLowerCase().includes(inputValue.toLowerCase())
		)
		.slice(0, 10);

	function addTopic(topic: string) {
		if (topic && !selectedTopics.includes(topic)) {
			selectedTopics = [...selectedTopics, topic.toLowerCase()];
			inputValue = '';
		}
	}

	function removeTopic(topic: string) {
		selectedTopics = selectedTopics.filter((t) => t !== topic);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTopic(inputValue.trim());
		} else if (e.key === 'Backspace' && !inputValue && selectedTopics.length > 0) {
			removeTopic(selectedTopics[selectedTopics.length - 1]);
		}
	}

	function handleInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		inputValue = target.value;
		open = target.value.length > 0;
	}
</script>

<div class="relative">
	<div
		class="flex min-h-12 flex-wrap content-start items-start gap-2 rounded-md border border-gray-300 bg-white p-2 focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500"
	>
		{#each selectedTopics as topic (topic)}
			<div
				class="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
			>
				<span>{topic}</span>
				<button
					type="button"
					on:click={() => removeTopic(topic)}
					class="font-semibold hover:text-blue-600"
					aria-label="Remove {topic}"
				>
					×
				</button>
			</div>
		{/each}

		<input
			{id}
			type="text"
			value={inputValue}
			on:input={handleInputChange}
			on:keydown={handleKeyDown}
			on:focus={() => {
				if (inputValue.length > 0) open = true;
			}}
			on:blur={() => {
				setTimeout(() => {
					open = false;
				}, 200);
			}}
			placeholder={selectedTopics.length === 0 ? 'Type a topic...' : ''}
			class="min-w-32 flex-1 py-1 focus:outline-none"
		/>
	</div>

	{#if open && (filtered.length > 0 || inputValue)}
		<div
			class="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
		>
			{#if filtered.length > 0}
				{#each filtered as topic}
					<button
						type="button"
						on:click={() => addTopic(topic)}
						class="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
					>
						<span class="text-sm">{topic}</span>
					</button>
				{/each}
			{/if}

			{#if inputValue && !suggestedTopics.includes(inputValue.toLowerCase())}
				<button
					type="button"
					on:click={() => addTopic(inputValue)}
					class="w-full border-t px-4 py-2 text-left font-medium text-blue-600 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
				>
					Add '{inputValue}' as new topic
				</button>
			{/if}
		</div>
	{/if}
</div>
