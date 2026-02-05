<script lang="ts">
	import { systemDesigns } from '$lib/stores/system-designs';
	import type { SystemDesign } from '$lib/api/types';

	export let initialData: SystemDesign | null = null;
	export let onSubmit: (data: any) => Promise<void>;

	let title = initialData?.title || '';
	let description = initialData?.description || '';
	let dataFlow = initialData?.dataFlow || '';
	let scalability = initialData?.scalability || '';
	let reliability = initialData?.reliability || '';
	let diagram = initialData?.diagram || '';
	let featured = initialData?.featured || false;
	let componentsJson = JSON.stringify(initialData?.components || { components: [] }, null, 2);

	async function handleSubmit() {
		try {
			const data = {
				title,
				description,
				dataFlow,
				scalability,
				reliability,
				diagram,
				featured,
				components: JSON.parse(componentsJson)
			};
			await onSubmit(data);
		} catch (err) {
			console.error('Failed to submit:', err);
		}
	}
</script>

<div class="space-y-6 rounded-lg bg-white p-6 shadow">
	<div>
		<label for="title" class="mb-2 block text-sm font-medium text-gray-700">Title</label>
		<input
			id="title"
			type="text"
			bind:value={title}
			placeholder="e.g., Microservices Architecture"
			class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
		/>
	</div>

	<div>
		<label for="description" class="mb-2 block text-sm font-medium text-gray-700">Description</label
		>
		<textarea
			id="description"
			bind:value={description}
			placeholder="Describe the system design overview..."
			rows="4"
			class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
		/>
	</div>

	<div>
		<label for="dataFlow" class="mb-2 block text-sm font-medium text-gray-700">Data Flow</label>
		<textarea
			id="dataFlow"
			bind:value={dataFlow}
			placeholder="Describe how data flows through the system..."
			rows="3"
			class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
		/>
	</div>

	<div>
		<label for="scalability" class="mb-2 block text-sm font-medium text-gray-700">Scalability</label
		>
		<textarea
			id="scalability"
			bind:value={scalability}
			placeholder="How does this system scale?"
			rows="3"
			class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
		/>
	</div>

	<div>
		<label for="reliability" class="mb-2 block text-sm font-medium text-gray-700">Reliability</label
		>
		<textarea
			id="reliability"
			bind:value={reliability}
			placeholder="Reliability characteristics and guarantees..."
			rows="3"
			class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
		/>
	</div>

	<div>
		<label for="components" class="mb-2 block text-sm font-medium text-gray-700"
			>Components (JSON)</label
		>
		<textarea
			id="components"
			bind:value={componentsJson}
			placeholder={'{"components": [{"name": "API Server"}]}'}
			rows="6"
			class="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
		/>
	</div>

	<div>
		<label for="diagram" class="mb-2 block text-sm font-medium text-gray-700">Diagram URL</label>
		<input
			id="diagram"
			type="url"
			bind:value={diagram}
			placeholder="https://..."
			class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
		/>
	</div>

	<div class="flex items-center gap-2">
		<input
			id="featured"
			type="checkbox"
			bind:checked={featured}
			class="h-4 w-4 rounded border-gray-300 text-blue-600"
		/>
		<label for="featured" class="text-sm font-medium text-gray-700">Featured Design</label>
	</div>

	<button
		on:click={handleSubmit}
		class="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
	>
		{initialData ? 'Update Design' : 'Create Design'}
	</button>
</div>
