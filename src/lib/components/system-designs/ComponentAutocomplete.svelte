<script lang="ts">
	export let selectedComponents: string[] = [];

	const commonComponents = [
		'API Server',
		'Database',
		'Cache Layer',
		'Message Queue',
		'Load Balancer',
		'CDN',
		'Authentication Service',
		'Storage Service',
		'Search Engine',
		'Analytics',
		'Monitoring',
		'Logging',
		'Service Registry',
		'API Gateway'
	];

	let filteredComponents = commonComponents;
	let search = '';

	$: filteredComponents = commonComponents.filter((c) =>
		c.toLowerCase().includes(search.toLowerCase())
	);

	function toggleComponent(component: string) {
		if (selectedComponents.includes(component)) {
			selectedComponents = selectedComponents.filter((c) => c !== component);
		} else {
			selectedComponents = [...selectedComponents, component];
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && search && !selectedComponents.includes(search)) {
			selectedComponents = [...selectedComponents, search];
			search = '';
		} else if (e.key === 'Backspace' && !search && selectedComponents.length > 0) {
			selectedComponents = selectedComponents.slice(0, -1);
		}
	}
</script>

<div class="space-y-2">
	<div class="flex flex-wrap gap-2">
		{#each selectedComponents as component (component)}
			<div class="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1">
				<span class="text-sm font-medium text-blue-900">{component}</span>
				<button
					on:click={() => toggleComponent(component)}
					class="text-blue-600 hover:text-blue-900"
				>
					✕
				</button>
			</div>
		{/each}
	</div>

	<div>
		<input
			type="text"
			bind:value={search}
			on:keydown={handleKeydown}
			placeholder="Search or add component..."
			class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
		/>
	</div>

	<div class="max-h-48 overflow-y-auto rounded-lg border border-gray-200">
		{#each filteredComponents as component (component)}
			<button
				on:click={() => toggleComponent(component)}
				class={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
					selectedComponents.includes(component) ? 'bg-blue-50' : ''
				}`}
			>
				{selectedComponents.includes(component) ? '✓' : '○'}
				{component}
			</button>
		{/each}
	</div>
</div>
