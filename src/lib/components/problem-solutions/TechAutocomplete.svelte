<script lang="ts">
	/**
	 * TechAutocomplete Component
	 * A fancy tag input with autocomplete for technologies/skills
	 */

	let inputValue = '';
	let open = false;

	export let selectedTechs: string[] = [];
	export let id: string = 'tech-autocomplete';
	export let suggestedTechs: string[] = [
		'JavaScript',
		'TypeScript',
		'Go',
		'Python',
		'Rust',
		'Java',
		'C#',
		'C++',
		'React',
		'Vue',
		'Svelte',
		'Angular',
		'Node.js',
		'Express',
		'FastAPI',
		'Django',
		'PostgreSQL',
		'MongoDB',
		'Redis',
		'Docker',
		'Kubernetes',
		'AWS',
		'Google Cloud',
		'Azure',
		'GraphQL',
		'REST',
		'gRPC',
		'WebSocket',
		'Kafka',
		'RabbitMQ'
	];

	$: filteredSuggestions = suggestedTechs.filter(
		(tech) =>
			tech.toLowerCase().includes(inputValue.toLowerCase()) &&
			!selectedTechs.some((s) => s.toLowerCase() === tech.toLowerCase())
	);

	function addTech(tech: string) {
		if (!selectedTechs.includes(tech) && tech.trim()) {
			selectedTechs = [...selectedTechs, tech.trim()];
			inputValue = '';
			open = false;
		}
	}

	function removeTech(tech: string) {
		selectedTechs = selectedTechs.filter((t) => t !== tech);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && inputValue.trim()) {
			e.preventDefault();
			addTech(inputValue.trim());
		} else if (e.key === 'Backspace' && !inputValue && selectedTechs.length > 0) {
			removeTech(selectedTechs[selectedTechs.length - 1]);
		}
	}

	function handleInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		inputValue = target.value;
		open = target.value.length > 0;
	}
</script>

<div class="relative">
	<div class="min-h-12 flex flex-wrap gap-2 content-start items-start p-2 bg-white border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
		{#each selectedTechs as tech (tech)}
			<div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
				<span>{tech}</span>
				<button
					type="button"
					on:click={() => removeTech(tech)}
					class="hover:text-blue-600 font-semibold"
					aria-label="Remove {tech}"
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
			placeholder={selectedTechs.length === 0 ? 'Type a technology...' : ''}
			class="flex-1 min-w-32 py-1 focus:outline-none"
		/>
	</div>

	{#if open && filteredSuggestions.length > 0}
		<div class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
			{#each filteredSuggestions as tech (tech)}
				<button
					type="button"
					on:click={() => addTech(tech)}
					class="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-900 focus:bg-blue-100 focus:outline-none"
				>
					{tech}
				</button>
			{/each}
		</div>
	{/if}

	{#if open && inputValue && filteredSuggestions.length === 0 && !selectedTechs.some((s) => s.toLowerCase() === inputValue.toLowerCase())}
		<div class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
			<button
				type="button"
				on:click={() => addTech(inputValue)}
				class="w-full text-left px-4 py-2 hover:bg-green-50 text-green-700 hover:text-green-900 focus:bg-green-100 focus:outline-none"
			>
				Add "{inputValue}"
			</button>
		</div>
	{/if}
</div>
