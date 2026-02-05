<script lang="ts">
	import type { Report } from '$lib/api/types';

	export let initialData: Report | null | undefined = undefined;
	export let onSubmit: (data: any) => Promise<void>;

	let name = initialData?.name || '';
	let description = initialData?.description || '';
	let sectionsJson = JSON.stringify(initialData?.sections || {}, null, 2);
	let filtersJson = JSON.stringify(initialData?.filters || {}, null, 2);
	let favorite = initialData?.isFavorite || false;
	let isSubmitting = false;
	let error: string | null = null;

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;
		error = null;

		try {
			let sections, filters;
			try {
				sections = sectionsJson ? JSON.parse(sectionsJson) : undefined;
				filters = filtersJson ? JSON.parse(filtersJson) : undefined;
			} catch (err) {
				throw new Error('Invalid JSON in sections or filters');
			}

			const data = {
				name: name.trim(),
				description: description.trim(),
				sections,
				filters,
				favorite
			};

			await onSubmit(data);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save report';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form on:submit={handleSubmit} class="space-y-6">
	<div>
		<label class="mb-2 block text-sm font-medium text-gray-700">Report Name *</label>
		<input
			type="text"
			bind:value={name}
			required
			placeholder="e.g., Monthly Performance Report"
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
		/>
	</div>

	<div>
		<label class="mb-2 block text-sm font-medium text-gray-700">Description</label>
		<textarea
			bind:value={description}
			placeholder="Describe what this report contains..."
			rows="3"
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
		/>
	</div>

	<div>
		<label class="mb-2 block text-sm font-medium text-gray-700">Sections (JSON)</label>
		<textarea
			bind:value={sectionsJson}
			placeholder={'{"metrics": {}, "timeline": {}}'}
			rows="5"
			class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm text-xs focus:border-blue-500 focus:outline-none"
		/>
	</div>

	<div>
		<label class="mb-2 block text-sm font-medium text-gray-700">Filters (JSON)</label>
		<textarea
			bind:value={filtersJson}
			placeholder={'{"dateRange": "30d", "status": "active"}'}
			rows="4"
			class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm text-xs focus:border-blue-500 focus:outline-none"
		/>
	</div>

	<div class="flex items-center gap-3">
		<input
			type="checkbox"
			id="favorite"
			bind:checked={favorite}
			class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
		/>
		<label for="favorite" class="text-sm font-medium text-gray-700">Mark as favorite</label>
	</div>

	{#if error}
		<div class="rounded-lg bg-red-50 p-3 text-sm text-red-700">
			{error}
		</div>
	{/if}

	<div class="flex gap-3">
		<button
			type="submit"
			disabled={isSubmitting || !name.trim()}
			class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{isSubmitting ? 'Saving...' : initialData ? 'Update Report' : 'Create Report'}
		</button>
		<a
			href="/reports"
			class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
		>
			Cancel
		</a>
	</div>
</form>
